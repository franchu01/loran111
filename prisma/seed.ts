import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create users
  const lolaPassword = await bcrypt.hash("111", 12);
  const franPassword = await bcrypt.hash("admin", 12);

  const lola = await prisma.user.upsert({
    where: { name: "lola" },
    update: {},
    create: { name: "lola", password: lolaPassword },
  });

  const fran = await prisma.user.upsert({
    where: { name: "fran" },
    update: {},
    create: { name: "fran", password: franPassword },
  });

  console.log(`Created users: ${lola.name}, ${fran.name}`);

  // Sample entries
  const existingEntries = await prisma.entry.count();
  if (existingEntries === 0) {
    await prisma.entry.createMany({
      data: [
        {
          restaurantName: "Don Julio",
          location: "Palermo, Buenos Aires",
          date: new Date("2026-03-15"),
          rating: 5,
          orderedItems: JSON.stringify(["Bife de chorizo", "Entraña", "Provoleta", "Malbec"]),
          bestItem: "Bife de chorizo",
          worstItem: "Provoleta",
          shouldReturn: true,
          notes: "Uno de los mejores asados de Buenos Aires. La carne estaba perfecta.",
          userId: fran.id,
        },
        {
          restaurantName: "El Preferido de Palermo",
          location: "Palermo Soho, Buenos Aires",
          date: new Date("2026-02-28"),
          rating: 4,
          orderedItems: JSON.stringify(["Milanesa napolitana", "Tortilla española", "Revuelto gramajo"]),
          bestItem: "Milanesa napolitana",
          worstItem: "Revuelto gramajo",
          shouldReturn: true,
          notes: "Clásico porteño. Un poco lento el servicio pero la comida vale la pena.",
          userId: lola.id,
        },
        {
          restaurantName: "Café Tortoni",
          location: "San Nicolás, Buenos Aires",
          date: new Date("2026-01-20"),
          rating: 3,
          orderedItems: JSON.stringify(["Medialunas", "Café con leche", "Facturas"]),
          bestItem: "Medialunas",
          worstItem: "Café con leche",
          shouldReturn: false,
          notes: "Muy turístico. Rico para conocer pero los precios no justifican para repetir.",
          userId: fran.id,
        },
      ],
    });

    // Sample wishlist items
    await prisma.wishlist.createMany({
      data: [
        {
          restaurantName: "Tegui",
          location: "Palermo, Buenos Aires",
          notes: "Dicen que es el mejor restaurante de fine dining en BA. Hay que reservar con anticipación.",
          userId: lola.id,
        },
        {
          restaurantName: "La Mar",
          location: "Palermo, Buenos Aires",
          notes: "Cebichería peruana de Gastón Acurio. Nos lo recomendaron varios.",
          userId: fran.id,
        },
      ],
    });

    console.log("Created sample entries and wishlist items");
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
