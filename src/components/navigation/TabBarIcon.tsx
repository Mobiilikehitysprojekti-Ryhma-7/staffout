import React from "react";
import type { ElementType, ComponentProps } from "react";

type IconType = ElementType;

export type IconName<C extends IconType> =
  ComponentProps<C> extends { name: infer N } ? N : never;

export function TabBarIcon<C extends IconType>({
  Icon,
  name,
  color,
  size = 28,
}: {
  Icon: C;
  name: IconName<C>;
  color: string;
  size?: number;
}) {
  const IconComp = Icon as any;

  return (
    <IconComp
      name={name}
      size={size}
      color={color}
      style={{ marginBottom: -3 }}
    />
  );
}
