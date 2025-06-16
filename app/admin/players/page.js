// app/admin/players/page.js

import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import Character from '../../models/Character';
import Link from 'next/link';

async function getPlayers() {
    await dbConnect();
    const users = await User.find({}).lean();
    const characters = await Character.find({}).select('userId').lean();
    const userIdsWithCharacter = new Set(characters.map(c => c.userId.toString()));

    const populatedUsers = users.map(user => ({
        ...user,
        hasCharacter: userIdsWithCharacter.has(user._id.toString())
    }));

    return JSON.parse(JSON.stringify(populatedUsers));
}

export default async function AdminPlayersPage() {
    const players = await getPlayers();

    return (
        <div className="sheet-box">
            <h2>Todos los Jugadores</h2>

            {/* --- INICIO DEL CAMBIO --- */}
            {/* Añadimos este div contenedor alrededor de la tabla */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre de Jugador</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Hoja de Personaje</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
                            <tr key={player._id}>
                                <td>{player.name}</td>
                                <td>{player.email}</td>
                                <td>{player.role}</td>
                                <td>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className={`status-dot ${player.hasCharacter ? 'success' : 'failure'}`}></span>
                                        {player.hasCharacter ? 'Existente' : 'No Creada'}
                                    </span>
                                </td>
                                <td>
                                    {player.hasCharacter ? (
                                        <Link href={`/admin/players/${player._id}/edit`}>
                                            <button className="action-button">Editar Hoja</button>
                                        </Link>
                                    ) : (
                                        <button className="action-button" disabled>
                                            Editar Hoja
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* --- FIN DEL CAMBIO --- */}
            
        </div>
    );
}