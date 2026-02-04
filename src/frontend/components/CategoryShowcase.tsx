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
            if (selectedFlavor === "semi") return "/images/products/bombones-rellenos-semi.jpg";
            if (selectedFlavor === "white") return "/images/products/bombones-rellenos-blanco.jpg";
            if (selectedFlavor === "milk") return "/images/products/bombones-rellenos-leche.jpg";
        }
        if (type.id === "Simples Chicos") {
            if (selectedFlavor === "semi") return "/images/products/simples-chicos-semi.jpg";
            if (selectedFlavor === "white") return "/images/products/simples-chicos-blanco.jpg";
            if (selectedFlavor === "milk") return "/images/products/simples-chicos-leche.jpg";
        }
        if (type.id === "Simples Grandes") {
            if (selectedFlavor === "semi") return "/images/products/simples-grandes-semi.jpg";
            if (selectedFlavor === "white") return "/images/products/simples-grandes-blanco.jpg";
            if (selectedFlavor === "milk") return "/images/products/simples-grandes-leche.jpg";
        }
        if (type.id === "Tabletas Chicas") {
            if (selectedFlavor === "semi") return "/images/products/tabletas-chicas-semi.jpg";
            if (selectedFlavor === "white") return "/images/products/tabletas-chicas-blanco.jpg";
            if (selectedFlavor === "milk") return "/images/products/tabletas-chicas-leche.jpg";
        }
        if (type.id === "Barritas Rellenas") {
            if (selectedFlavor === "semi") return "/images/products/barritas-rellenas-semi.jpg";
            if (selectedFlavor === "white") return "/images/products/barritas-rellenas-blanco.jpg";
            // Milk is missing, return null to show placeholder
            if (selectedFlavor === "milk") return null;
        }
        return null; // Placeholder for others
    };

    const getObjectPosition = () => {
        if (type.id === "Simples Chicos") {
            if (selectedFlavor === "semi" || selectedFlavor === "milk") return "center 65%";
        }
        if (type.id === "Simples Grandes") {
            // "move it a little to the left" -> object-position: left center (or maybe 30% center?)
            // Let's try 30% 50% to shift focus left.
            if (selectedFlavor === "semi" || selectedFlavor === "milk") return "30% 50%";
        }
        if (type.id === "Barritas Rellenas") {
            // "move above" -> center 75% (moved from 65%)
            return "center 75%";
        }
        return "center center";
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
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: getObjectPosition(),
                            transition: "src 0.3s ease"
                        }}
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

                {/* Details: Weight & Size */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .category-card-details {
                        display: flex;
                        justify-content: space-between;
                        font-size: ${typography.sizes.sm};
                        color: ${colors.textLight};
                        font-weight: 500;
                        margin-bottom: ${spacing.md};
                    }
                    @media (max-width: 768px) {
                        .category-card-details {
                            flex-direction: column;
                            gap: ${spacing.xs};
                            align-items: flex-start;
                        }
                    }
                `}} />
                <div className="category-card-details">
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
            className="showcase-section"
            style={{
                backgroundColor: colors.white,
            }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                .showcase-section {
                    padding: ${spacing.xl};
                }
                .showcase-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: ${spacing.sm};
                    max-width: 1200px;
                    margin: 0 auto;
                }
                @media (max-width: 768px) {
                    .showcase-section {
                        padding: ${spacing.md};
                    }
                    /* Ensure 2 columns on smaller mobile screens */
                    .showcase-grid {
                        grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
                    }
                }
            `}} />
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

            <div className="showcase-grid">
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
