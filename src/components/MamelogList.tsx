"use client";

import { Mamelog } from "@/types/mamelog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  mamelogs: Mamelog[];
};

export default function MamelogList({ mamelogs }: Props) {
  return (
    <main>
      {mamelogs.map((item) => (
        <div key={item.id}>
          <Card className="w-[90%] justify-center mb-3">
            <CardHeader>
              <CardTitle>{item.shop_name}</CardTitle>
              <CardDescription>{item.country_name}</CardDescription>
              <CardDescription>{item.farm}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      ))}
    </main>
  );
}
