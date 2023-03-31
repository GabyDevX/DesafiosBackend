const productsMutation = `
    addProduct(data: ProductInput) : Product
    updateProductById(id: ID!, data: ProductInput) : Product
    deleteProductById(id: ID!) : ID
`;

export default productsMutation;
