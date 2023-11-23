import { Router } from "express";

export interface Route{
    getRoutes(): Router;
}