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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
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
    } catch {
      toast.error("削除に失敗しました");
    }
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setOpen(true);
  };

  if (!mamelogs || mamelogs.length === 0) {
    return (
      <main>
        <PostForm
          onSuccess={() => {
            setOpen(false);
            onSuccess?.();
          }}
          isOpen={open}
          onOpenChange={setOpen}
        />
        <div className="my-8 flex min-h-[calc(100svh-330px)] flex-col items-center justify-center rounded-2xl border border-dashed border-primary/25 bg-white/80 px-6 text-center">
          <Coffee className="mb-6 h-16 w-16 text-primary/80" />
          <div className="mb-3 text-xl font-semibold tracking-tight text-foreground">
            まめログが未登録です
          </div>
          <div className="text-sm leading-7 text-muted-foreground">
            <button
              type="button"
              onClick={openCreateDialog}
              className="mx-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white align-middle shadow transition hover:bg-primary/90"
              aria-label="まめログを登録"
            >
              <SquarePen size={14} />
            </button>
            ボタンから最初の豆を登録しましょう
          </div>
        </div>
      </main>
    );
  }

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
              <Card className="relative mb-3 cursor-pointer rounded-xl border-primary/10 py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-4 h-8 w-8 rounded-full text-primary/60 hover:bg-gray-100"
                  onClick={() => {
                    setEditingItem(item);
                    setOpen(true);
                  }}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                <CardHeader>
                  <CardTitle>{item.shop_name}</CardTitle>
                  <CardDescription className="mt-1">
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

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-4 h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消せません。
                        <br />
                        対象のまめログが完全に削除されます。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(item.id)}>
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
              className="w-64 space-y-1 border border-gray-200 bg-white text-sm shadow-md"
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
