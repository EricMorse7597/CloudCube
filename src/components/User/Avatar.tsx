// 'use client'
import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import { supabase } from "src/utils/SupabaseClient";
// import { createClient } from '@/utils/supabase/client'
// import Image from 'next/image'


const AvatarUploadWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    user-select: none;
`


const AvatarImage = styled.img<{ size: number }>`
    height: ${({ size }) => size}px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    pointer-events: none;
`

const AvatarUploadButton = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    border: 2px solid;
    border-radius: 4px;
    cursor: pointer;
    transition: filter 0.2s;

    &:hover {
        filter: brightness(0.7);
    }

    &:active {
        filter: brightness(0.5);
    }
`


export default function Avatar({
    uid,
    url,
    size,
    onUpload,
}: {
    uid: string | null
    url: string | null
    size: number
    onUpload: (url: string) => void
}) {
    // const supabase = createClient()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage.from('avatars').download(path)
                if (error) {
                    throw error
                }

                const url = URL.createObjectURL(data)
                setAvatarUrl(url)
            } catch (error) {
                console.log('Error downloading image: ', error)
            }
        }

        if (url) downloadImage(url)
    }, [url, supabase])

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${uid}-${Math.random()}.${fileExt}`

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            onUpload(filePath)
        } catch (error) {
            alert('Error uploading avatar!')
        } finally {
            setUploading(false)
        }
    }

    return (
        <AvatarUploadWrapper>
            <AvatarImage
                src={avatarUrl? avatarUrl : "/assets/default.png"}
                alt="Avatar"
                className="avatar image"
                size={size}
            />


            <AvatarUploadButton className="avatarButton" htmlFor="single" style={{ border: "2px solid", borderRadius: "4px", padding: "8px 12px" }}>
                {uploading ? 'Uploading ...' : 'Upload'}
            </AvatarUploadButton>
            <input
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                }}
                type="file"
                id="single"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
            />

        </AvatarUploadWrapper >
    )
}