import * as repository from '../repository/productRepository.js';

/** 상품 데이터 전체 호출 **/
export const getProductAll = async(req, res) => {
    const result = await repository.getProductAll(req.body);
    res.json(result);
    res.end();
}

/** 상품 아이디 별 데이터 호출 **/
export const getItem = async(req, res) => {
    const result = await repository.getItem(req.body);
    // console.log("controller :: result --> ", result);
    res.json(result);
    res.end();
}

