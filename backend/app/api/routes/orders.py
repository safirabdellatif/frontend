from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

from app.schemas.orders import CreateOrderRequest, CreateOrderResponse, UpsellRequest, UpsellResponse
from app.services.orders import create_order, process_upsell

router = APIRouter()


@router.post("", response_model=CreateOrderResponse)
async def post_order(body: CreateOrderRequest, request: Request, background_tasks: BackgroundTasks):
    headers = dict(request.headers)
    return await create_order(body, headers, background_tasks)


@router.post("/{order_id}/upsell", response_model=UpsellResponse)
async def post_upsell(order_id: str, body: UpsellRequest, background_tasks: BackgroundTasks):
    response, status = await process_upsell(order_id, body, background_tasks)
    if status == 404:
        raise HTTPException(status_code=404, detail="Order not found")
    if status == 422:
        raise HTTPException(status_code=422, detail="Order not eligible for upsell")
    return response
