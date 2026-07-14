"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type CommonProps = {
  event: AnalyticsEvent;
  eventParams?: Record<string, string | number | undefined>;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

type InternalProps = CommonProps & {
  kind: "internal";
  href: string;
};

type ExternalProps = CommonProps & {
  kind: "external";
  href: string;
  target?: string;
  rel?: string;
};

type AnchorProps = CommonProps & {
  kind: "anchor";
  href: string;
};

export type TrackedLinkProps = InternalProps | ExternalProps | AnchorProps;

export function TrackedLink(props: TrackedLinkProps) {
  const handleClick = () => {
    trackEvent(props.event, props.eventParams);
  };

  if (props.kind === "internal") {
    return (
      <Link
        href={props.href}
        className={props.className}
        aria-label={props.ariaLabel}
        onClick={handleClick}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <a
      href={props.href}
      target={props.kind === "external" ? props.target ?? "_blank" : undefined}
      rel={
        props.kind === "external"
          ? props.rel ?? "noopener noreferrer"
          : undefined
      }
      className={props.className}
      aria-label={props.ariaLabel}
      onClick={handleClick}
    >
      {props.children}
    </a>
  );
}
