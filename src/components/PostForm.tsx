"use client";

import { useEffect, useState } from "react";
import { addMamelog, setMamelog } from "@/lib/firebase/mamelog";
import { Mamelog } from "@/types/mamelog";
import mstData from "@/data/mst.json"; // mst.jsonをインポート
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
} from "lucide-react";
interface Props {
  onSuccess?: () => void;
  isOpen?: boolean;
  initialData?: Mamelog;
  onOpenChange: (open: boolean) => void;
}
const getInitialFormState = () => ({
  id: "",
  product_name: "",
  country_name: "",
  region_name: "",
  district_name: "",
  comment: "",
  exp_date: new Date().toISOString(),
  farm: "",
  flavor: "",
  generation: "",
  is_blend: false,
  price: 0,
  purchase_date: new Date().toISOString(),
  regist_user: getAuth().currentUser?.uid || "",
  roast_date: new Date().toISOString(),
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
  const [isDetailsOpen, setisDetailsOpen] = useState(false);
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
    setLoading(true);
    try {
      if (initialData && initialData.id) {
        await setMamelog(initialData.id, form);
        toast.success("まめログを更新しました！");
        setForm(getInitialFormState());
      } else {
        await addMamelog(form);
        toast.success("まめログの登録が完了しました！");
        setForm(getInitialFormState());
      }
      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("保存に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!initialData && user) {
      setForm((prev) => ({ ...prev, regist_user: user.uid }));
    }
    if (initialData) {
      setForm({
        ...initialData,
        id: initialData.id,
        // 以下、初期データにない場合に備えてfallbackを設定
        exp_date: initialData.exp_date || new Date().toISOString(),
        purchase_date: initialData.purchase_date || new Date().toISOString(),
        roast_date: initialData.roast_date || new Date().toISOString(),
        create_at: initialData.create_at || new Date().toISOString(),
        update_at: new Date().toISOString(), // 更新日だけは常に今
      });
    }
  }, [initialData]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90%] max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-primary/70 font-bold mb-2">
              {initialData ? "まめログを編集" : "まめログを登録"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 min-h-0">
            <form
              id="mamelog-form"
              onSubmit={handleSubmit}
              className="space-y-5 overflow-y-auto flex-1 min-h-0 pr-4"
            >
              <div>
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="purchase_date"
                >
                  <Calendar className="w-4 h-4 mb-0.5 text-primary/80" />
                  購入日<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="purchase_date"
                  name="purchase_date"
                  type="date"
                  value={form.purchase_date.slice(0, 10)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      purchase_date: e.target.value,
                    }))
                  }
                  className={`border p-2 w-full ${
                    errors.purchase_date ? "border-red-500" : ""
                  }`}
                />
              </div>
              <div>
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="shop_name"
                >
                  <Store className="w-4 h-4 mb-0.5 text-primary/80" />
                  ショップ<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="shop_name"
                    name="shop_name"
                    placeholder="購入店舗"
                    value={form.shop_name}
                    onChange={handleChange}
                    className={`border p-2 w-full pr-16 ${
                      errors.shop_name ? "border-red-500" : ""
                    }`}
                    maxLength={30}
                  />
                  <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                    {form.shop_name.length}/30
                  </span>
                </div>
              </div>

              <div>
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="country_name"
                >
                  <Globe className="w-4 h-4 mb-0.5 text-primary/80" />
                  生産国<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.country_name}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, country_name: value }))
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.country_name ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="国を選択" />
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
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="roast_level"
                >
                  <Flame className="w-4 h-4 mb-0.5 text-primary/80" />
                  焙煎度<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.roast_level}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, roast_level: value }))
                  }
                >
                  <SelectTrigger className="w-full">
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

              <div>
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="roast_date"
                >
                  <Calendar className="w-4 h-4 mb-0.5 text-primary/80" />
                  焙煎日
                </Label>
                <Input
                  id="roast_date"
                  name="roast_date"
                  type="date"
                  value={form.roast_date.slice(0, 10)} // YYYY-MM-DD だけを表示
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      roast_date: e.target.value,
                    }))
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div>
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="generation"
                >
                  <Sparkles className="w-4 h-4 mb-0.5  text-primary/80" />
                  精製方法
                </Label>
                <Select
                  value={form.generation}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, generation: value }))
                  }
                >
                  <SelectTrigger className={`w-full`}>
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
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="farm"
                >
                  <Sprout className="w-4 h-4 mb-0.5 text-primary/80" />
                  農園
                </Label>
                <div className="relative">
                  <Input
                    id="farm"
                    name="farm"
                    placeholder="農園"
                    value={form.farm}
                    onChange={handleChange}
                    className="border p-2 w-full pr-16"
                    maxLength={30}
                  />
                  <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                    {form.farm.length}/30
                  </span>
                </div>
              </div>
              <div>
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="volume"
                >
                  <Weight className="w-4 h-4 mb-0.5 text-primary/80" />
                  内容量（グラム）
                </Label>
                <div className="relative">
                  <Input
                    id="volume"
                    name="volume"
                    type="number"
                    placeholder="内容量"
                    value={form.volume}
                    onChange={(e) => {
                      const val = e.target.value;
                      // 5桁制限＋空文字の場合は0、それ以外は数値変換
                      if (val.length <= 5) {
                        setForm((prev) => ({
                          ...prev,
                          volume:
                            val === "" ? 0 : Number(val.replace(/[^0-9]/g, "")),
                        }));
                      }
                    }}
                    className="border p-2 w-full pr-16"
                    maxLength={5}
                    max={99999}
                    inputMode="numeric"
                    pattern="\d*"
                  />
                  <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                    {form.volume ? String(form.volume).length : 0}/5
                  </span>
                </div>
              </div>
              <div>
                <Label
                  className="mb-2 text-gray-500 flex items-center gap-2"
                  htmlFor="price"
                >
                  <BadgeJapaneseYen className="w-4 h-4 mb-0.5 text-primary/80" />
                  価格
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="価格"
                    value={form.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      // 空なら0にする、そうでなければ数値に変換
                      if (val.length <= 5) {
                        setForm((prev) => ({
                          ...prev,
                          price:
                            val === "" ? 0 : Number(val.replace(/[^0-9]/g, "")),
                        }));
                      }
                    }}
                    className="border p-2 w-full pr-16"
                    maxLength={5}
                    max={99999}
                    inputMode="numeric"
                    pattern="\d*"
                  />{" "}
                  <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                    {form.price ? String(form.price).length : 0}/5
                  </span>
                </div>
              </div>

              <Collapsible open={isDetailsOpen} onOpenChange={setisDetailsOpen}>
                <CollapsibleTrigger className="flex items-center space-x-2 text-sm text-primary/80 hover:underline">
                  {isDetailsOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  <span>詳細項目</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div>
                    <Label
                      className="mb-2 text-gray-500 flex items-center gap-2"
                      htmlFor="product_name"
                    >
                      <Tag className="w-4 h-4 mb-0.5 text-primary/80" />
                      商品名
                    </Label>
                    <div className="relative">
                      <Input
                        id="product_name"
                        name="product_name"
                        placeholder="商品名"
                        value={form.product_name}
                        onChange={handleChange}
                        className="border p-2 w-full pr-16"
                        maxLength={30}
                      />
                      <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                        {form.product_name.length}/30
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label
                      className="mb-2 text-gray-500 flex items-center gap-2"
                      htmlFor="district_name"
                    >
                      <MapPin className="w-4 h-4 mb-0.5 text-primary/80" />
                      地区名
                    </Label>
                    <div className="relative">
                      <Input
                        id="district_name"
                        name="district_name"
                        placeholder="地区名"
                        value={form.district_name}
                        onChange={handleChange}
                        className="border p-2 w-full pr-16"
                        maxLength={30}
                      />
                      <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                        {form.district_name.length}/30
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label
                      className="mb-2 text-gray-500 flex items-center gap-2"
                      htmlFor="flavor"
                    >
                      <Flower className="w-4 h-4 mb-0.5 text-primary/80" />
                      フレーバー
                    </Label>
                    <div className="relative">
                      <Input
                        id="flavor"
                        name="flavor"
                        placeholder="フレーバー"
                        value={form.flavor}
                        onChange={handleChange}
                        className="border p-2 w-full pr-16"
                        maxLength={50}
                      />
                      <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                        {form.flavor.length}/50
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label
                      className="mb-2 text-gray-500 flex items-center gap-2"
                      htmlFor="comment"
                    >
                      <MessageSquareText className="w-4 h-4 mb-0.5 text-primary/80" />
                      コメント
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="comment"
                        name="comment"
                        placeholder="コメント"
                        value={form.comment}
                        onChange={handleChange}
                        className="border p-2 w-full pr-16"
                        maxLength={300}
                      />
                      <span className="absolute right-2 bottom-2 text-xs text-gray-400 select-none">
                        {form.comment.length}/300
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label
                      className="mb-2 text-gray-500 flex items-center gap-2"
                      htmlFor="exp_date"
                    >
                      <Calendar className="w-4 h-4 mb-0.5 text-primary/80" />
                      賞味期限
                    </Label>
                    <Input
                      id="exp_date"
                      name="exp_date"
                      type="date"
                      value={form.exp_date.slice(0, 10)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          exp_date: e.target.value,
                        }))
                      }
                      className="border p-2 w-full"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </form>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              form="mamelog-form"
              className="py-2 w-full rounded flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mb-0.5 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading
                ? initialData
                  ? "更新中..."
                  : "登録中..."
                : initialData
                ? "更新する"
                : "登録する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
