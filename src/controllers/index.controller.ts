import { Request, Response } from "express"
import { QueryResult } from 'pg'
import { pool } from '../database'

export const getUsers = async (req: Request,res: Response): Promise<Response> => {
    try {
        const allUsers: QueryResult = await pool.query('SELECT * FROM users');
        return res.status(200).json(allUsers.rows);
    } catch (error) {
        return res.status(500).json('Something goes wrong, try later');
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        const userById: QueryResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return res.status(200).json(userById.rows);
    } catch (error) {
        return res.status(500).json('Something goes wrong, try later');
    }
}

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email } = req.body
        if ( !name || !email ) return res.status(400).json({errors: 'Missing fields check body and try again'})
        const generateUser: QueryResult = await pool.query('INSERT INTO users(name, email) VALUES ($1, $2)', [name, email])
        return res.status(201).json({ msg: 'User has been created', data: { name, email } });
    } catch (error) {
        return res.status(500).json('Something goes wrong, try later');
    }
}

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        const { name, email } = req.body;
        await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
        return res.status(200).json({ msg: 'User has been modify', data: { name, email }});
    } catch (error) {
        return res.status(500).json('Something goes wrong, try later');
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return res.status(200).json({ msg: `User with ${id} has been removed` });
    } catch (error) {
        return res.status(500).json('Something goes wrong, try later');
    }
}