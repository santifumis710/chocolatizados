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
            semi: "/placeholders/simples-chicos-semi.jpg",
            white: "/placeholders/simples-chicos-white.jpg",
            milk: "/placeholders/simples-chicos-milk.jpg",
        },
    },
    {
        id: "Simples Grandes",
        title: "Simples Grandes",
        weight: "9g",
        size: "4,5 x 2,5 cm",
        images: {
            semi: "/placeholders/simples-grandes-semi.jpg",
            white: "/placeholders/simples-grandes-white.jpg",
            milk: "/placeholders/simples-grandes-milk.jpg",
        },
    },
    {
        id: "Bombones Rellenos",
        title: "Bombones Rellenos",
        weight: "12g",
        size: "3 x 3 cm",
        images: {
            semi: "/placeholders/bombones-rellenos-semi.jpg",
            white: "/placeholders/bombones-rellenos-white.jpg",
            milk: "/placeholders/bombones-rellenos-milk.jpg",
        },
    },
    {
        id: "Tabletas Chicas",
        title: "Tabletas Chicas",
        weight: "18g",
        size: "6,5 x 4,8 cm",
        images: {
            semi: "/placeholders/tabletas-chicas-semi.jpg",
            white: "/placeholders/tabletas-chicas-white.jpg",
            milk: "/placeholders/tabletas-chicas-milk.jpg",
        },
    },
    {
        id: "Tabletas",
        title: "Tabletas Grandes",
        weight: "65g",
        size: "9,5 x 6,5 cm",
        images: {
            semi: "/placeholders/tabletas-semi.jpg",
            white: "/placeholders/tabletas-white.jpg",
            milk: "/placeholders/tabletas-milk.jpg",
        },
    },
];
