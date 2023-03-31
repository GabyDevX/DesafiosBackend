import { buildSchema } from "graphql";
import productType from "../graphQL/types/producto.js";
import productInput from "../graphQL/inputs/producto.js";
import productsQueries from "../graphQL/queries/producto.js";
import productsMutation from "../graphQL/mutations/producto.js";

export const productosSchema = buildSchema(`
${productType}
${productInput}
type Query {
    ${productsQueries}
}
type Mutation {
    ${productsMutation}
}
`);
