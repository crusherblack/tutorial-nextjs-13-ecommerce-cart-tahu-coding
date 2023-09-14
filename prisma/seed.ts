import prisma from "../src/lib/prisma";
import { faker } from "@faker-js/faker";

async function main() {
  try {
    const categoryCount = 4;
    const productCountPerCategory = 3;

    const categories = [];

    //create random categories
    for (let i = 0; i < categoryCount; i++) {
      const categoryName = faker.commerce.department() as string;
      const categorySlug = faker.helpers.slugify(categoryName);

      const isCategoryExisted = await prisma.category.findUnique({
        where: {
          slug: categorySlug,
        },
      });

      if (isCategoryExisted) {
        categories.push(isCategoryExisted);
      } else {
        const createdCategory = await prisma.category.create({
          data: {
            name: categoryName,
            slug: faker.helpers.slugify(categoryName),
          },
        });
        categories.push(createdCategory);
      }
    }

    //create products based on created categories
    for (const category of categories) {
      for (let i = 0; i < productCountPerCategory; i++) {
        const productName = faker.commerce.productName();
        const productDescription = faker.commerce.productDescription();
        const productPrice = +faker.commerce.price({
          min: 50000,
          max: 99999999,
        });
        const productImage = faker.image.url();
        const productQty = faker.number.int({ min: 1, max: 10 });
        const productSlug =
          faker.helpers.slugify(productName) +
          +faker.number.int({ min: 1, max: 1000 });

        await prisma.product.create({
          data: {
            name: productName,
            description: productDescription,
            price: productPrice,
            categoryId: category.id,
            image: productImage,
            qty: productQty,
            slug: productSlug,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
