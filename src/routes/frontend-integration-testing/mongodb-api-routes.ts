import { Request, Response, Router } from 'express';

export const router = Router();

// TODO actually, i should consider making just one route
//  that retrieves the mongodbapi config so that i can use it client side
//  then i should move the mongodb api class to client code and do all the testing
//  from there
//  when i move the code to the client, i should also uninstall axios  and
//  check if I need to remove anything from the .env

/**
 * Empty the database
 */
router.delete('/:dbName', async (req: Request, res: Response) => {});

/**
 * Get the user document with the specified id
 */
router.get('/:dbName/users/:userId', async (req: Request, res: Response) => {});

/**
 * Get the
 */
router.post('/:dbName/users', async (req: Request, res: Response) => {});

router.delete('/:dbName/users', async (req: Request, res: Response) => {});

router.get('/:dbName/chats/:chatId', async (req: Request, res: Response) => {});

router.post('/:dbName/users', async (req: Request, res: Response) => {});

router.delete('/:dbName/users', async (req: Request, res: Response) => {});

router.get('/:dbName/matches/:matchId', async (req: Request, res: Response) => {});

router.post('/:dbName/users', async (req: Request, res: Response) => {});

router.delete('/:dbName/users', async (req: Request, res: Response) => {});

router.get('/:dbName/matchmakingQueue/:userId', async (req: Request, res: Response) => {});

router.post('/:dbName/users', async (req: Request, res: Response) => {});

router.delete('/:dbName/users', async (req: Request, res: Response) => {});
