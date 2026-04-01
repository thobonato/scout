"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { cn } from "@/lib/utils";

export interface ProductCardProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  chewyUrl: string;
  price: number;
  originalPrice?: number;
  confidenceScore: number;
  reasonSnippet: string;
}

interface ProductCardProps {
  product: ProductCardProduct;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount =
    product.originalPrice !== undefined &&
    product.originalPrice > product.price;

  function handleAddToCart() {
    setIsAdded(true);
    onAddToCart?.(product.id);

    // Reset button after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  }

  return (
    <div className="flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md overflow-hidden">
      {/* Product Image */}
      <a
        href={product.chewyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-square w-full bg-gray-50"
        aria-label={`View ${product.name} on Chewy`}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 75vw, 280px"
        />
      </a>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Confidence Badge */}
        <ConfidenceBadge score={product.confidenceScore} />

        {/* Product Info */}
        <div>
          <p className="font-nunito text-xs text-gray-400 uppercase tracking-wide">
            {product.brand}
          </p>
          <h3 className="font-nunito text-sm font-semibold text-chewy-dark line-clamp-2 mt-0.5">
            {product.name}
          </h3>
        </div>

        {/* AI Reason */}
        <p className="font-nunito text-xs text-gray-500 leading-relaxed line-clamp-2 italic">
          &ldquo;{product.reasonSnippet}&rdquo;
        </p>

        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="font-fredoka text-lg font-semibold text-chewy-dark">
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="font-nunito text-xs text-gray-400 line-through">
              ${product.originalPrice!.toFixed(2)}
            </span>
          )}
          {hasDiscount && (
            <span className="font-nunito text-xs font-semibold text-green-600">
              Save ${(product.originalPrice! - product.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={cn(
            "mt-auto w-full rounded-full font-fredoka text-sm font-semibold transition-all duration-200",
            isAdded
              ? "bg-green-500 hover:bg-green-500 text-white"
              : "bg-chewy-blue hover:bg-chewy-blue/90 text-white",
          )}
        >
          {isAdded ? (
            <>
              <Check className="mr-1.5 size-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1.5 size-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
