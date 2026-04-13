"use client";

import Link from "next/link";
import { MapPin, CheckCircle, XCircle } from "lucide-react";
import StarRating from "./StarRating";
import UserBadge from "./UserBadge";
import { formatDate } from "@/lib/utils";

interface EntryCardProps {
  id: string;
  restaurantName: string;
  rating: number;
  date: string;
  location: string;
  shouldReturn: boolean;
  creatorName: string;
}

export default function EntryCard({
  id,
  restaurantName,
  rating,
  date,
  location,
  shouldReturn,
  creatorName,
}: EntryCardProps) {
  return (
    <Link href={`/entry/${id}`}>
      <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-[#3C241508]">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-lg text-espresso leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}
          >
            {restaurantName}
          </h3>
          <UserBadge name={creatorName} />
        </div>

        <StarRating value={rating} readonly size={18} />

        <div className="flex items-center gap-1.5 text-warm-gray text-sm">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-warm-gray text-sm">{formatDate(date)}</span>
          {shouldReturn ? (
            <span className="flex items-center gap-1 text-green-soft text-sm font-medium">
              <CheckCircle size={15} />
              Volver
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-soft text-sm font-medium">
              <XCircle size={15} />
              No volver
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
