import { AuthSession } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { db } from '../../utils/db'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { GetRoom } from '../../utils/hooks/useRoom'
import { Room } from '../../types/ash'
import { Layout } from '../../components/Layout'
import Link from 'next/link'

export interface Props {
    session: AuthSession
}

export default function RoomForm({ session }: Props) {
    const [updating, setUpdating] = useState(false)
    const [name, setName] = useState<string>('')
    const [notes, setNotes] = useState<string>('')
    const [description, setDescription] = useState<string>('')



    const { query, isReady } = useRouter()

    // if (!isReady) {
    //     return
    //     <>
    //         Loading
    //     </>
    // }

    const roomId = Number(query.id)

    const { loading, error, room } = GetRoom(session, roomId)


    useEffect(() => {
        if (room) {
            setName(room.name!)
            setNotes(room.notes!)
            setDescription(room.description!)
        }
    }, [room])

    async function updateRoom({
        name,
        notes,
        description,
    }: {
        name: string
        notes: string
        description: string
    }) {
        try {
            setUpdating(true)

            const updates = {
                name,
                notes,
                description,
            }

            console.log(updates)

            const { data, error } = await db
                .rooms()
                .update
                (updates, {

                })
                .eq('id', roomId)

            console.log('data', data)
            console.log('error', error)

            if (error) {
                throw error
            }
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUpdating(false)
        }
    }







    async function deleteRoom() {
        try {
            setUpdating(true)

            const { data, error } = await db
                .rooms()
                .delete()
                .eq('id', roomId)

            if (error) {
                throw error
            }
        } catch (error: any) {
            alert(error.message)
        } finally {
            setUpdating(false)

            // Redirect to the list of rooms
            Router.push('/room')
        }
    }






    if (loading) {
        return <p>Loading…</p>
    }

    if (error) {
        return <p>Error fetching room data.</p>
    }


    const roomEditForm = room ?? null ? (
        <div key={room?.id} className='my-4'>
            <h2>Name: {room?.name}</h2>
            <p>ID: {room?.id}</p>
            <p>Notes: {room?.notes}</p>
            <p>Description: {room?.description}</p>



            <form className="flex flex-col space-y-4">
                <div className="form-group">
                    <label className="label" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="field"
                        id="name"
                        type="text"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}

                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="notes">
                        Notes
                    </label>
                    <input
                        className="field"
                        disabled={updating}
                        id="notes"
                        type="text"
                        value={notes || ''}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label className="label" htmlFor="description">
                        Description
                    </label>
                    <input
                        className="field"
                        disabled={updating}
                        id="description"
                        type="text"
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <button
                        className="btn"
                        onClick={() => updateRoom({ name, notes, description })}
                        disabled={updating}
                    >
                        {updating ? 'Updating…' : 'Update'}
                    </button>
                </div>




                <div>
                    <button
                        className="btn btn-error btn-sm"
                        onClick={() => deleteRoom()}
                        disabled={updating}
                    >
                        {updating ? 'Updating…' : 'Delete'}
                    </button>
                </div>

            </form>

        </div>
    ) : <h2>nope</h2>



    return (

        <Layout session={session}>
            <Link href="/room">
                <button
                    className="btn">
                    Rooms
                </button>
            </Link>

            <h1>Room: #{roomId}</h1>

            {roomEditForm}

        </Layout>

    );
}

