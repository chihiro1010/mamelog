"use client";

import { useEffect, useState } from "react";
import { addMamelog } from "@/lib/firebase/mamelog";
import { Mamelog } from "@/types/mamelog";
import mstData from "@/data/mst.json"; // mst.jsonをインポート
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";
import { Button } from "./ui/button";
import { SquarePen } from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  onSuccess?: () => void;
}

export default function MamelogForm({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
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
    regist_user: "",
    roast_date: new Date().toISOString(),
    roast_level: "",
    shop_name: "",
    volume: 0,
    create_at: new Date().toISOString(),
    update_at: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({
    shop_name: false,
    country_name: false,
    roast_level: false,
  });

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
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);
    if (hasError) {
      toast.error("必須項目をすべて入力してください");
      return;
    }

    try {
      await addMamelog({ ...form });
      toast.success("まめログの登録が完了しました！");
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("登録に失敗しました。もう一度お試しください。");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setForm((prev) => ({ ...prev, regist_user: user.uid }));
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 bg-primary text-white p-5 rounded-full shadow-lg hover:bg-primary/90 transition">
            <SquarePen />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90%] max-w-2xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>まめログを登録</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="mb-2 text-gray-600" htmlFor="shop_name">
                ショップ<span className="text-red-500">*</span>
              </Label>
              <Input
                id="shop_name"
                name="shop_name"
                placeholder="購入店舗"
                value={form.shop_name}
                onChange={handleChange}
                className={`border p-2 w-full ${
                  errors.shop_name ? "border-red-500" : ""
                }`}
              />
            </div>

            <div>
              <Label className="mb-2 text-gray-600" htmlFor="country_name">
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
              <Label className="mb-2 text-gray-600" htmlFor="roast_level">
                焙煎度<span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.roast_level}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, roast_level: value }))
                }
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.country_name ? "border-red-500" : ""
                  }`}
                >
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
              <Label className="mb-2 text-gray-600" htmlFor="generation">
                精製方法
              </Label>
              <Input
                id="generation"
                name="generation"
                placeholder="精製方法"
                value={form.generation}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <Label className="mb-2 text-gray-600" htmlFor="farm">
                農園
              </Label>
              <Input
                id="farm"
                name="farm"
                placeholder="農園"
                value={form.farm}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <Label className="mb-2 text-gray-600" htmlFor="price">
                価格
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="価格"
                value={form.price}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            <div>
              <Label className="mb-2 text-gray-600" htmlFor="volume">
                内容量
              </Label>
              <Input
                id="volume"
                name="volume"
                type="number"
                placeholder="内容量"
                value={form.volume}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </div>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex items-center space-x-2 text-sm text-gray-600 hover:underline">
                {isOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
                <span>詳細項目</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div>
                  <Label
                    className="mb-2 text-gray-600 text-gray-600"
                    htmlFor="product_name"
                  >
                    商品名
                  </Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    placeholder="商品名"
                    value={form.product_name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 text-gray-600" htmlFor="district_name">
                    地区名
                  </Label>
                  <Input
                    id="district_name"
                    name="district_name"
                    placeholder="地区名"
                    value={form.district_name}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 text-gray-600" htmlFor="flavor">
                    フレーバー
                  </Label>
                  <Input
                    id="flavor"
                    name="flavor"
                    placeholder="フレーバー"
                    value={form.flavor}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 text-gray-600" htmlFor="comment">
                    コメント
                  </Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    placeholder="コメント"
                    value={form.comment}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div>
              <Button type="submit" className="py-2 w-full rounded">
                登録する
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
