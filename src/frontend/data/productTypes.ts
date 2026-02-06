export interface ProductType {
    id: string;
    title: string;
    weight: string;
    size: string;
    images: {
        semi: string;
        white: string;
        milk: string;
    };
}

export const productTypes: ProductType[] = [
    {
        id: "Simples Chicos",
        title: "Simples Chicos",
        weight: "5g",
        size: "3 x 2,5 cm",
        images: {
            semi: "/images/products/simples-chicos-semi-pastel.png",
            white: "/images/products/simples-chicos-blanco-pastel.png",
            milk: "/images/products/simples-chicos-leche-pastel.png",
        },
    },
    {
        id: "Simples Grandes",
        title: "Simples Grandes",
        weight: "9g",
        size: "4,5 x 2,5 cm",
        images: {
            semi: "/images/products/simples-grandes-tul-2-pastel-v6.png",
            white: "/images/products/simples-grandes-tul-2-pastel-v6.png",
            milk: "/images/products/simples-grandes-tul-2-pastel-v6.png",
        },
    },
    {
        id: "Bombones Rellenos",
        title: "Bombones Rellenos",
        weight: "12g",
        size: "3 x 3 cm",
        images: {
            semi: "/images/products/bombones-rellenos-tul-x2-pastel.png",
            white: "/images/products/bombones-rellenos-tul-x2-pastel.png",
            milk: "/images/products/bombones-rellenos-tul-x2-pastel.png",
        },
    },
    {
        id: "Tabletas Chicas",
        title: "Tabletas Chicas",
        weight: "18g",
        size: "6,5 x 4,8 cm",
        images: {
            semi: "/images/products/tabletas-chicas-tul-x2-pastel-v3.png",
            white: "/images/products/tabletas-chicas-tul-x2-pastel-v3.png",
            milk: "/images/products/tabletas-chicas-tul-x2-pastel-v3.png",
        },
    },
    {
        id: "Tabletas",
        title: "Tabletas Grandes",
        weight: "65g",
        size: "9,5 x 6,5 cm",
        images: {
            semi: "/images/products/tableta-grande-individual-dia-del-padre-pastel-v6.png",
            white: "/images/products/tableta-grande-individual-dia-del-padre-pastel-v6.png",
            milk: "/images/products/tableta-grande-individual-dia-del-padre-pastel-v6.png",
        },
    },
];
