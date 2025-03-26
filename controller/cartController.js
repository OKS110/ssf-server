import * as repository from '../repository/cartRepository.js';

// 아이디 번호 호출
export const getCustomerId = async(req, res) => {
    const result = await repository.getCustomerId(req.body);
    res.json(result);
    res.end();
}

// 카트 상품 추가
export const saveToCart = async(req, res) => {
    const result = await repository.saveToCart(req.body);
    res.json(result);
    res.end();
}

// 카트 전체 상품 호출
export const getCartItems = async(req, res) => {
    const result = await repository.getCartItems(req.body);
    res.json(result);
    res.end();
}

// 상품 상세 페이지 상품 수량 업데이트
export const updateDetailQty = async(req, res) => {
    const result = await repository.updateDetailQty(req.body);
    res.json(result);
    res.end();
}

// 장바구니 페이지 상품 수량 변경
export const changeQty = async(req, res) => {
    const result = await repository.changeQty(req.body);
    res.json(result);
    res.end();
}

// 장바구니 페이지 - 아이템 개별 삭제
export const cartDeleteItem = async(req, res) => {
    const result = await repository.cartDeleteItem(req.body);
    res.json(result);
    res.end();
}

// 비회원일 때 장바구니 상품 데이터 호출
export const getGuestCartItems = async(req, res) => {
    const result = await repository.getGuestCartItems(req.body);
    // console.log("controlloer :: getGuestCartItems result --> ", result);
    res.json(result);
    res.end();
}