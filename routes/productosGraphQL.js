import { Router } from "express";
import { productosSchema } from "../controllers/productosGraphQL.js";
import { graphqlHTTP } from "express-graphql";
import graphQLRootValue from "../graphQL/rootValue.js";

const router = Router();

router.use(
  `/`,
  graphqlHTTP({
    schema: productosSchema,
    rootValue: graphQLRootValue(),
    graphiql: true,
  })
);

export default router;
