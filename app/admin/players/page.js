import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import Character from '../../models/Character';
import Link from 'next/link';

async function getPlayers() {
    await dbConnect();
    const users = await User.find({}).lean();
    // Obtenemos solo los IDs de los usuarios que SÍ tienen un personaje
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
        <div>
            <h2>Todos los Jugadores</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: 'var(--color-earth-brown)', color: 'var(--color-parchment)'}}>
                        <th style={{padding: '10px', textAlign: 'left'}}>Nombre de Jugador</th>
                        <th style={{padding: '10px', textAlign: 'left'}}>Email</th>
                        <th style={{padding: '10px', textAlign: 'left'}}>Rol</th>
                        <th style={{padding: '10px', textAlign: 'left'}}>Hoja de Personaje</th>
                        <th style={{padding: '10px', textAlign: 'left'}}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map(player => (
                        <tr key={player._id} style={{ borderBottom: '1px solid var(--color-old-gold)'}}>
                            <td style={{padding: '10px'}}>{player.name}</td>
                            <td style={{padding: '10px'}}>{player.email}</td>
                            <td style={{padding: '10px'}}>{player.role}</td>
                            <td style={{padding: '10px'}}>
                                {player.hasCharacter ? 
                                    <span style={{color: 'var(--color-success-green)'}}>✓ Existente</span> : 
                                    <span style={{color: 'var(--color-failure-red)'}}>✗ No Creada</span>
                                }
                            </td>
                            <td style={{padding: '10px'}}>
                                {player.hasCharacter ? (
                                    <Link href={`/admin/players/${player._id}/edit`}>
                                        <button style={{width: 'auto', padding: '5px 10px'}}>Editar Hoja</button>
                                    </Link>
                                ) : (
                                    <button style={{width: 'auto', padding: '5px 10px', backgroundColor: '#aaa', cursor: 'not-allowed'}} disabled>
                                        Editar Hoja
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
