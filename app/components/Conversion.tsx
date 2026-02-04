// Esta funcion convierte un array de URLs gs:// a URLs HTTP.
// Recibe un array de strings y devuelve un nuevo array con las URLs convertidas.


export function convertirGSUrl(gsurl: string) {
    const bucket = "portafoliodeibyramirez.firebasestorage.app";
    const path = gsurl.replace(`gs://${bucket}/`, "").replace(/\//g, "%2F").replace(/ /g, "%20");
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${path}?alt=media`;
}   

