"use client";

import { useEffect, useState } from "react";
import { addMamelog, setMamelog } from "@/lib/firebase/mamelog";
import { Mamelog } from "@/types/mamelog";
import mstData from "@/data/mst.json";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { Button } from "./ui/button";
import { getAuth } from "firebase/auth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Store,
  Globe,
  Flame,
  BadgeJapaneseYen,
  Sparkles,
  Sprout,
  MapPin,
  Tag,
  Flower,
  MessageSquareText,
  ChevronDown,
  ChevronRight,
  Save,
  Weight,
  Loader2,
  Calendar,
  Info,
} from "lucide-react";

interface Props {
  onSuccess?: () => void;
  isOpen?: boolean;
  initialData?: Mamelog;
  onOpenChange: (open: boolean) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

const getInitialFormState = () => ({
  id: "",
  product_name: "",
  country_name: "",
  region_name: "",
  district_name: "",
  comment: "",
  exp_date: "",
  farm: "",
  flavor: "",
  generation: "",
  is_blend: false,
  price: 0,
  purchase_date: today(),
  regist_user: getAuth().currentUser?.uid || "",
  roast_date: "",
  roast_level: "",
  shop_name: "",
  volume: 0,
  create_at: new Date().toISOString(),
  update_at: new Date().toISOString(),
});

export default function PostForm({
  onSuccess,
  isOpen,
  initialData,
  onOpenChange,
}: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [form, setForm] = useState(getInitialFormState);
  const [errors, setErrors] = useState({
    shop_name: false,
    country_name: false,
    roast_level: false,
    purchase_date: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleNumberChange = (name: "volume" | "price", value: string) => {
    const normalized = value.replace(/[^0-9]/g, "").slice(0, 5);
    setForm((prev) => ({
      ...prev,
      [name]: normalized === "" ? 0 : Number(normalized),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      shop_name: form.shop_name.trim() === "",
      country_name: form.country_name.trim() === "",
      roast_level: form.roast_level.trim() === "",
      purchase_date: form.purchase_date.trim() === "",
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) {
      toast.error("必須項目をすべて入力してください");
      return;
    }

    const normalizedForm = {
      ...form,
      shop_name: form.shop_name.trim(),
      farm: form.farm.trim(),
      district_name: form.district_name.trim(),
      product_name: form.product_name.trim(),
      flavor: form.flavor.trim(),
      comment: form.comment.trim(),
      roast_date: form.roast_date || form.purchase_date,
      exp_date: form.exp_date || form.purchase_date,
    };

    setLoading(true);
    try {
      if (initialData && initialData.id) {
        await setMamelog(initialData.id, normalizedForm);
        toast.success("まめログを更新しました");
      } else {
        await addMamelog(normalizedForm);
        toast.success("まめログを登録しました");
      }

      setForm(getInitialFormState());
      setIsDetailsOpen(false);
      onSuccess?.();
    } catch {
      toast.error("保存に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!initialData) {
      setForm({ ...getInitialFormState(), regist_user: user?.uid || "" });
      return;
    }

    setForm({
      ...initialData,
      id: initialData.id,
      exp_date: initialData.exp_date || "",
      purchase_date: initialData.purchase_date?.slice(0, 10) || today(),
      roast_date: initialData.roast_date || "",
      create_at: initialData.create_at || new Date().toISOString(),
      update_at: new Date().toISOString(),
    });
  }, [initialData, isOpen]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-[560px] max-h-[92svh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="border-b bg-muted/40 px-5 py-4">
            <DialogTitle className="text-primary font-bold">
              {initialData ? "まめログを編集" : "まめログを登録"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> * は必須項目です
            </p>
          </DialogHeader>

          <div className="overflow-y-auto px-5 py-4">
            <form id="mamelog-form" onSubmit={handleSubmit} className="space-y-5">
              <section className="space-y-4 rounded-lg border p-4">
                <h3 className="text-sm font-semibold">基本情報</h3>

                <div>
                  <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="purchase_date">
                    <Calendar className="w-4 h-4 text-primary/80" />
                    購入日<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="purchase_date"
                    name="purchase_date"
                    type="date"
                    value={form.purchase_date}
                    onChange={handleChange}
                    className={errors.purchase_date ? "border-red-500" : ""}
                  />
                </div>

                <div>
                  <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="shop_name">
                    <Store className="w-4 h-4 text-primary/80" />
                    ショップ<span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="shop_name"
                      name="shop_name"
                      placeholder="例: 〇〇 COFFEE"
                      value={form.shop_name}
                      onChange={handleChange}
                      className={`pr-14 ${errors.shop_name ? "border-red-500" : ""}`}
                      maxLength={30}
                    />
                    <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                      {form.shop_name.length}/30
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="country_name">
                    <Globe className="w-4 h-4 text-primary/80" />
                    生産国<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.country_name}
                    onValueChange={(value) => {
                      setForm((prev) => ({ ...prev, country_name: value }));
                      setErrors((prev) => ({ ...prev, country_name: false }));
                    }}
                  >
                    <SelectTrigger className={errors.country_name ? "border-red-500" : ""}>
                      <SelectValue placeholder="生産国を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {mstData.countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="roast_level">
                    <Flame className="w-4 h-4 text-primary/80" />
                    焙煎度<span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.roast_level}
                    onValueChange={(value) => {
                      setForm((prev) => ({ ...prev, roast_level: value }));
                      setErrors((prev) => ({ ...prev, roast_level: false }));
                    }}
                  >
                    <SelectTrigger className={errors.roast_level ? "border-red-500" : ""}>
                      <SelectValue placeholder="焙煎度を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {mstData.roast_levels_jp.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>

              <section className="space-y-4 rounded-lg border p-4">
                <h3 className="text-sm font-semibold">任意項目</h3>

                <div>
                  <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="roast_date">
                    <Calendar className="w-4 h-4 text-primary/80" /> 焙煎日
                  </Label>
                  <Input
                    id="roast_date"
                    name="roast_date"
                    type="date"
                    value={form.roast_date ? form.roast_date.slice(0, 10) : ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="generation">
                    <Sparkles className="w-4 h-4 text-primary/80" /> 精製方法
                  </Label>
                  <Select
                    value={form.generation}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, generation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="精製方法を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {mstData.generations.map((generation) => (
                        <SelectItem key={generation} value={generation}>
                          {generation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="farm">
                    <Sprout className="w-4 h-4 text-primary/80" /> 農園
                  </Label>
                  <div className="relative">
                    <Input
                      id="farm"
                      name="farm"
                      placeholder="例: La Esperanza"
                      value={form.farm}
                      onChange={handleChange}
                      className="pr-14"
                      maxLength={30}
                    />
                    <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                      {form.farm.length}/30
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="volume">
                      <Weight className="w-4 h-4 text-primary/80" /> 内容量(g)
                    </Label>
                    <Input
                      id="volume"
                      name="volume"
                      type="text"
                      inputMode="numeric"
                      placeholder="例: 200"
                      value={form.volume === 0 ? "" : String(form.volume)}
                      onChange={(e) => handleNumberChange("volume", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="price">
                      <BadgeJapaneseYen className="w-4 h-4 text-primary/80" /> 価格(円)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      inputMode="numeric"
                      placeholder="例: 1600"
                      value={form.price === 0 ? "" : String(form.price)}
                      onChange={(e) => handleNumberChange("price", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium text-primary/90 hover:bg-accent/20">
                  <span>詳細設定（必要な場合のみ）</span>
                  {isDetailsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-4 rounded-lg border p-4">
                  <div>
                    <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="product_name">
                      <Tag className="w-4 h-4 text-primary/80" /> 商品名
                    </Label>
                    <Input
                      id="product_name"
                      name="product_name"
                      placeholder="例: エチオピア イルガチェフェ"
                      value={form.product_name}
                      onChange={handleChange}
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="district_name">
                      <MapPin className="w-4 h-4 text-primary/80" /> 地区名
                    </Label>
                    <Input
                      id="district_name"
                      name="district_name"
                      placeholder="例: Sidama"
                      value={form.district_name}
                      onChange={handleChange}
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="flavor">
                      <Flower className="w-4 h-4 text-primary/80" /> フレーバー
                    </Label>
                    <Input
                      id="flavor"
                      name="flavor"
                      placeholder="例: ベリー / チョコ / シトラス"
                      value={form.flavor}
                      onChange={handleChange}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="comment">
                      <MessageSquareText className="w-4 h-4 text-primary/80" /> コメント
                    </Label>
                    <Textarea
                      id="comment"
                      name="comment"
                      placeholder="味の感想や次回のメモを入力"
                      value={form.comment}
                      onChange={handleChange}
                      maxLength={300}
                    />
                    <p className="text-right text-xs text-gray-400 mt-1">{form.comment.length}/300</p>
                  </div>

                  <div>
                    <Label className="mb-2 text-gray-600 flex items-center gap-2" htmlFor="exp_date">
                      <Calendar className="w-4 h-4 text-primary/80" /> 賞味期限
                    </Label>
                    <Input
                      id="exp_date"
                      name="exp_date"
                      type="date"
                      value={form.exp_date ? form.exp_date.slice(0, 10) : ""}
                      onChange={handleChange}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </form>
          </div>

          <DialogFooter className="border-t bg-white px-5 py-4">
            <Button
              type="submit"
              form="mamelog-form"
              className="w-full rounded-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? (initialData ? "更新中..." : "登録中...") : initialData ? "更新する" : "登録する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
