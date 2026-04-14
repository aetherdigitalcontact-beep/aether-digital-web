import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { image, userId } = await req.json();

        if (!image || !image.startsWith('data:image/')) {
            return NextResponse.json({ error: 'Formato de imagen inválido' }, { status: 400 });
        }

        // Intentar crear el bucket si no existe (con Service Role para evitar problemas de RLS)
        await supabase.storage.createBucket('avatars', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
            fileSizeLimit: 2 * 1024 * 1024 // 2MB
        }).catch(() => {
            // Ignorar errores si ya existe o no hay permisos suficientes para crear
        });

        // Extraer datos Base64
        const parts = image.split(',');
        const base64Data = parts[1];
        const mimeType = parts[0].split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1];
        const fileName = `${userId || 'public'}/${Date.now()}.${extension}`;

        // Convertir a Buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Subir a Supabase Storage
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, buffer, {
                contentType: mimeType,
                upsert: true
            });

        if (error) {
            console.error('Supabase Storage Error:', error);
            return NextResponse.json({ error: 'Error al subir la imagen a la nube' }, { status: 500 });
        }

        // Obtener URL Pública
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
