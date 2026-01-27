import React, { useState } from "react";
import { productTypes, ProductType } from "@/data/productTypes";
import { colors, spacing, typography } from "@/theme";

interface CategoryShowcaseProps {
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

type Flavor = "semi" | "white" | "milk";

const FlavorButton = ({
    flavor,
    isSelected,
    onClick
}: {
    flavor: Flavor;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}) => {
    // Colors for the buttons
    const flavorColors = {
        semi: "#4A3728", // Dark chocolate
        white: "#F5E6D3", // White chocolate
        milk: "#8B5A2B",  // Milk chocolate
    };

    // Tooltips/Labels
    const flavorLabels = {
        semi: "Semi Amargo",
        white: "Blanco",
        milk: "Con Leche",
    };

    return (
        <div
            onClick={onClick}
            title={flavorLabels[flavor]}
            style={{
                width: "24px",
                height: "24px",
                backgroundColor: flavorColors[flavor],
                border: isSelected
                    ? `2px solid ${colors.primary}`
                    : `1px solid ${colors.border}`,
                borderRadius: "4px",
                cursor: "pointer",
                boxShadow: isSelected ? "0 0 0 2px rgba(166, 76, 62, 0.4)" : "none",
                transform: isSelected ? "scale(1.1)" : "scale(1)",
                transition: "all 0.2s",
            }}
        />
    );
};

const CategoryCard = ({
    type,
    isSelected,
    onToggle
}: {
    type: ProductType;
    isSelected: boolean;
    onToggle: () => void;
}) => {
    const [selectedFlavor, setSelectedFlavor] = useState<Flavor>("milk"); // Default to milk
    const [imgError, setImgError] = useState(false);

    const handleFlavorClick = (e: React.MouseEvent, flavor: Flavor) => {
        e.stopPropagation(); // Prevent triggering the card selection
        setSelectedFlavor(flavor);
    };

    // Helper to get image path based on type and flavor
    const getImagePath = () => {
        if (type.id === "Tabletas") {
            if (selectedFlavor === "semi") return "/images/products/tableta-semi-amargo.jpg";
            if (selectedFlavor === "white") return "/images/products/tableta-blanco.jpg";
            if (selectedFlavor === "milk") return "/images/products/tableta-leche.jpg";
        }
        if (type.id === "Bombones Rellenos") {
            if (selectedFlavor === "milk") return "/images/products/bombones-rellenos.jpg";
            return null; // No image for other flavors yet
        }
        return null; // Placeholder for others
    };

    // Reset error when flavor or type changes
    React.useEffect(() => {
        setImgError(false);
    }, [selectedFlavor, type.id]);

    const imagePath = getImagePath();

    return (
        <div
            onClick={onToggle}
            style={{
                border: `2px solid ${isSelected ? colors.primary : colors.border}`,
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                backgroundColor: isSelected ? "#FDF8F5" : "transparent",
                boxShadow: isSelected
                    ? "0 4px 12px rgba(166, 76, 62, 0.2)"
                    : "none",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Image Area */}
            <div style={{
                height: "150px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative"
            }}>
                {imagePath && !imgError ? (
                    <img
                        key={imagePath} // Force remount on path change
                        src={imagePath}
                        alt={`${type.title} ${selectedFlavor}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "src 0.3s ease" }}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <>
                        <span style={{ fontSize: "40px", marginBottom: spacing.xs }}>🍫</span>
                        <span style={{ color: "#aaa", fontWeight: "bold" }}>
                            {type.title}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#ccc" }}>
                            Preview
                        </span>
                    </>
                )}
            </div>

            <div style={{ padding: spacing.md, flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{
                    margin: `0 0 ${spacing.sm} 0`,
                    color: colors.primary,
                    fontSize: typography.sizes.lg,
                    fontWeight: "900",
                    fontFamily: typography.fontFamily,
                }}>
                    {type.title}
                </h3>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: typography.sizes.sm,
                    color: colors.textLight,
                    fontWeight: "500",
                    marginBottom: spacing.md
                }}>
                    <span>⚖️ {type.weight}</span>
                    <span>📏 {type.size}</span>
                </div>

                {/* Flavor Buttons Section */}
                <div style={{
                    marginTop: "auto", // Push to bottom
                    borderTop: `1px solid ${colors.border}`,
                    paddingTop: spacing.md,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <span style={{ fontSize: "0.8rem", color: colors.textLight }}>Ver sabor:</span>
                    <div style={{ display: "flex", gap: spacing.sm }}>
                        <FlavorButton
                            flavor="semi"
                            isSelected={selectedFlavor === 'semi'}
                            onClick={(e) => handleFlavorClick(e, 'semi')}
                        />
                        <FlavorButton
                            flavor="white"
                            isSelected={selectedFlavor === 'white'}
                            onClick={(e) => handleFlavorClick(e, 'white')}
                        />
                        <FlavorButton
                            flavor="milk"
                            isSelected={selectedFlavor === 'milk'}
                            onClick={(e) => handleFlavorClick(e, 'milk')}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <section
            style={{
                padding: spacing.xl,
                backgroundColor: colors.white,
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    textAlign: "center",
                    marginBottom: spacing.xl,
                }}
            >
                <h2
                    style={{
                        fontSize: typography.sizes.xl,
                        color: colors.primary,
                        marginBottom: spacing.md,
                        fontWeight: "900",
                    }}
                >
                    Nuestros Tamaños
                </h2>
                <p style={{ color: colors.textLight, fontWeight: "400" }}>
                    Selecciona un tamaño para ver las distintas presentaciones. Prueba los botones de colores para ver las variantes.
                </p>
            </div>

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: spacing.md,
                }}
            >
                {productTypes.map((type) => (
                    <CategoryCard
                        key={type.id}
                        type={type}
                        isSelected={selectedCategory === type.id}
                        onToggle={() => onSelectCategory(selectedCategory === type.id ? null : type.id)}
                    />
                ))}
            </div>
        </section>
    );
};
