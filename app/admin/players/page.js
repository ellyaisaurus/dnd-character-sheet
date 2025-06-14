import dbConnect from '../../lib/mongodb';
import Character from '../../models/Character';

async function getAllModifications() {
    await dbConnect();
    const characters = await Character.find({}).populate('userId', 'name').lean();
    
    const allLogs = [];
    characters.forEach(char => {
        if (!char.userId) return;
        const playerName = char.userId.name;
        
        Object.keys(char).forEach(statKey => {
            const stat = char[statKey];
            if (stat && Array.isArray(stat.modifications) && stat.modifications.length > 0) {
                stat.modifications.forEach(mod => {
                    allLogs.push({
                        id: `${char._id}-${statKey}-${mod._id}`,
                        playerName,
                        characterName: char.characterName,
                        stat: statKey,
                        value: mod.value,
                        reason: mod.reason,
                        date: mod.date,
                    });
                });
            }
        });
    });

    allLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    return JSON.parse(JSON.stringify(allLogs));
}

export default async function AdminLogsPage() {
    const logs = await getAllModifications();

    return (
        <div className="sheet-box">
            <h2>Log Global de Modificaciones</h2>
            <ul className="admin-logs-list">
                {logs.map((log) => (
                    <li key={log.id} className="admin-log-item">
                        <strong>{log.playerName}</strong> ({log.characterName}) modificó <strong>{log.stat}</strong>:
                        <span className={log.value > 0 ? 'mod-pos' : 'mod-neg'}>
                            {log.value > 0 ? ` +${log.value}` : ` ${log.value}`}
                        </span>
                        por '{log.reason}' el <em>{new Date(log.date).toLocaleString()}</em>
                    </li>
                ))}
            </ul>
        </div>
    );
}