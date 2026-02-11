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
            semi: "/images/products/simples-grandes-semi-pastel.png",
            white: "/images/products/simples-grandes-blanco-pastel.png",
            milk: "/images/products/simples-grandes-leche-pastel.png",
        },
    },
    {
        id: "Bombones Rellenos",
        title: "Bombones Rellenos",
        weight: "12g",
        size: "3 x 3 cm",
        images: {
            semi: "/images/products/bombones-rellenos-semi-pastel.png",
            white: "/images/products/bombones-rellenos-blanco-pastel.png",
            milk: "/images/products/bombones-rellenos-leche-pastel.png",
        },
    },
    {
        id: "Tabletas Chicas",
        title: "Tabletas Chicas",
        weight: "18g",
        size: "6,5 x 4,8 cm",
        images: {
            semi: "/images/products/tabletas-chicas-semi-pastel.png",
            white: "/images/products/tabletas-chicas-blanco-pastel.png",
            milk: "/images/products/tabletas-chicas-leche-pastel.png",
        },
    },
    {
        id: "Tabletas",
        title: "Tabletas Grandes",
        weight: "65g",
        size: "9,5 x 6,5 cm",
        images: {
            semi: "/images/products/tableta-semi-amargo-pastel.png",
            white: "/images/products/tableta-blanco-pastel.png",
            milk: "/images/products/tableta-leche-pastel.png",
        },
    },
];
