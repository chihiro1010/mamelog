"use client";

import { Mamelog } from "@/types/mamelog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteMamelog } from "@/lib/firebase/mamelog";
import { Button } from "./ui/button";
import { PenLine, Coffee, Trash2, SquarePen } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import PostForm from "@/components/PostForm";
import { useState } from "react";

type Props = {
  mamelogs: Mamelog[];
  onSuccess?: () => void;
};

// 日付をyyyy/mm/dd形式にフォーマットするヘルパー関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0から始まるので+1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export default function MamelogList({ mamelogs, onSuccess }: Props) {
  const [editingItem, setEditingItem] = useState<Mamelog | null>(null);
  const [open, setOpen] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      await deleteMamelog(id);
      toast.success("削除が完了しました");
      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("削除に失敗しました");
    }
  };

  if (!mamelogs || mamelogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 my-8 text-gray-500">
        <Coffee className="w-16 h-16 mb-4 text-brown-400" />
        <div className="text-lg font-medium mb-2">
          マメログが未登録のようです。
        </div>
        <div className="text-m text-gray-400">
          右下の
          <span className="inline-block align-middle mx-1">
            <span className="inline-flex items-center justify-center bg-primary text-white w-6 h-6 rounded-full shadow">
              <SquarePen size={16} />
            </span>
          </span>
          ボタンから追加しましょう！
        </div>
      </div>
    );
  } else {
    return (
      <main>
        <PostForm
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
          isOpen={open}
          initialData={editingItem || undefined}
          onOpenChange={setOpen}
        />
        {mamelogs.map((item) => (
          <div key={item.id}>
            <Popover>
              <PopoverTrigger asChild>
                <Card className="relative mb-2 rounded-sm cursor-pointer">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-4 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                    onClick={() => {
                      setEditingItem(item); // 対象を設定
                      setOpen(true); // フォームを開く
                    }}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <CardTitle>{item.shop_name}</CardTitle>
                    <CardDescription className="mt-2">
                      {item.country_name}
                      {item.country_name && item.farm ? " / " : ""}
                      {item.farm}
                    </CardDescription>
                    <CardDescription>
                      {item.generation}
                      {item.generation && item.roast_level ? " / " : ""}
                      {item.roast_level}
                    </CardDescription>
                  </CardHeader>

                  {/* 削除ボタン */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-4 h-8 w-8 rounded-full text-red-500 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          本当に削除しますか？
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          この操作は取り消せません。
                          <br />
                          対象のまめログが完全に削除されます。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                        >
                          削除する
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>
              </PopoverTrigger>

              <PopoverContent
                side="top"
                align="center"
                className="w-64 text-sm space-y-1 bg-white border border-gray-200 shadow-md"
              >
                {item.shop_name && (
                  <p>
                    <strong>ショップ:</strong> {item.shop_name}
                  </p>
                )}
                {item.country_name && (
                  <p>
                    <strong>生産国:</strong> {item.country_name}
                  </p>
                )}
                {item.roast_level && (
                  <p>
                    <strong>焙煎度:</strong> {item.roast_level}
                  </p>
                )}
                {item.generation && (
                  <p>
                    <strong>精製方法:</strong> {item.generation}
                  </p>
                )}
                {item.farm && (
                  <p>
                    <strong>農園:</strong> {item.farm}
                  </p>
                )}
                {item.price !== 0 && item.price && (
                  <p>
                    <strong>価格:</strong> ¥ {item.price}
                  </p>
                )}
                {item.volume !== 0 && item.volume && (
                  <p>
                    <strong>内容量:</strong> {item.volume} g
                  </p>
                )}
                {item.product_name && (
                  <p>
                    <strong>商品名:</strong> {item.product_name}
                  </p>
                )}
                {item.district_name && (
                  <p>
                    <strong>地区名:</strong> {item.district_name}
                  </p>
                )}
                {item.flavor && (
                  <p>
                    <strong>フレーバー:</strong> {item.flavor}
                  </p>
                )}
                {item.roast_date && (
                  <p>
                    <strong>焙煎日:</strong> {formatDate(item.roast_date)}
                  </p>
                )}
                {item.purchase_date && (
                  <p>
                    <strong>購入日:</strong> {formatDate(item.purchase_date)}
                  </p>
                )}
                {item.exp_date && (
                  <p>
                    <strong>賞味期限:</strong> {formatDate(item.exp_date)}
                  </p>
                )}
                {item.comment && (
                  <p>
                    <strong>コメント:</strong> {item.comment}
                  </p>
                )}
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </main>
    );
  }
}
