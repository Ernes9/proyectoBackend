import { assert } from "chai";
import * as ProductService from "../../src/services/products.service.js"

describe(
    "Testing del servicio de productos",
    () => {
        it(
            "Testeando que la lectura de productos responde un array",
            async()=> {
                const response = await ProductService.getAllProducts()
                assert.strictEqual(Array.isArray(response), true)
            }
        )
    }
)