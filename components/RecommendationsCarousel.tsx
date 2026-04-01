"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardProduct } from "@/components/ProductCard";

interface RecommendationsCarouselProps {
  products: ProductCardProduct[];
  isLoading?: boolean;
  onAddToCart?: (productId: string) => void;
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-gray-100 bg-white overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-5 w-24 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function RecommendationsCarousel({
  products,
  isLoading = false,
  onAddToCart,
}: RecommendationsCarouselProps) {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-fredoka text-xl font-semibold text-chewy-dark">
            Recommended for your pet ✨
          </h2>
          <p className="font-nunito text-xs text-gray-400 mt-0.5">
            AI-curated picks based on your pet&apos;s profile
          </p>
        </div>
      </div>

      {/* Carousel */}
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-3 basis-[75%] sm:basis-[45%] lg:basis-[30%]"
                >
                  <ProductCardSkeleton />
                </CarouselItem>
              ))
            : products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-3 basis-[75%] sm:basis-[45%] lg:basis-[30%]"
                >
                  <ProductCard product={product} onAddToCart={onAddToCart} />
                </CarouselItem>
              ))}
        </CarouselContent>

        {/* Nav arrows — hidden on mobile, shown sm+ */}
        <div className="hidden sm:block">
          <CarouselPrevious className="-left-4 border-gray-200 bg-white shadow-sm hover:bg-gray-50" />
          <CarouselNext className="-right-4 border-gray-200 bg-white shadow-sm hover:bg-gray-50" />
        </div>
      </Carousel>

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-12 text-center">
          <span className="text-3xl">🐾</span>
          <p className="mt-2 font-fredoka text-base text-gray-400">
            No recommendations yet
          </p>
          <p className="font-nunito text-xs text-gray-400">
            Complete your pet&apos;s profile to get AI picks
          </p>
        </div>
      )}
    </section>
  );
}
