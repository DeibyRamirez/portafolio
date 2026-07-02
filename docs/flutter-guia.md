# Guia Flutter — API del Portafolio y subida de imagenes

Guia practica para crear la app movil admin: seleccionar fotos en el dispositivo, enviarlas a la API y que esta las suba automaticamente a Firebase Storage.

> Referencia HTTP completa: [`api.md`](./api.md) · Modelos de datos: [`modelos.md`](./modelos.md)

---

## Como funciona (resumen)

```text
┌─────────────┐     multipart/form-data      ┌─────────────┐     gs://       ┌──────────────┐
│  App Flutter │  ─────────────────────────► │  API Vercel  │ ────────────► │   Firebase   │
│ image_picker │   data (JSON) + imagenes    │  Next.js     │   Storage     │   Storage    │
└─────────────┘                              └──────┬───────┘               └──────────────┘
                                                    │
                                                    ▼
                                              ┌───────────┐
                                              │  MongoDB  │
                                              └───────────┘
```

**Tu app NO sube a Firebase directamente.** Solo selecciona archivos y los manda a la API. La API:

1. Guarda el proyecto/certificado en MongoDB.
2. Crea la carpeta en Storage con el titulo del recurso.
3. Renombra las imagenes a `{titulo}_1.png`, `{titulo}_2.png`, etc.
4. Devuelve el JSON con las rutas `gs://` ya guardadas.

---

## Configuracion inicial

### 1. Variables de entorno (`.env`)

```env
API_BASE_URL=https://TU-DOMINIO.vercel.app/api
PORTFOLIO_API_KEY=tu_clave_secreta
```

Agrega `.env` a `.gitignore`. En `pubspec.yaml`:

```yaml
flutter:
  assets:
    - .env
```

### 2. Dependencias

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  flutter_dotenv: ^5.2.1
  image_picker: ^1.0.0
  cached_network_image: ^3.4.0   # opcional, para mostrar imagenes
```

### 3. Permisos

**Android** (`android/app/src/main/AndroidManifest.xml`):

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
<!-- Android < 13 -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

**iOS** (`ios/Runner/Info.plist`):

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceder a tus fotos para subir capturas de proyectos.</string>
<key>NSCameraUsageDescription</key>
<string>Necesitamos la camara para tomar fotos de proyectos.</string>
```

### 4. URLs segun entorno

| Donde pruebas | `API_BASE_URL` |
| --- | --- |
| Emulador Android | `http://10.0.2.2:3000/api` |
| Simulador iOS | `http://localhost:3000/api` |
| Celular fisico (misma red) | `http://192.168.x.x:3000/api` |
| Produccion | `https://tu-dominio.vercel.app/api` |

### 5. main.dart

```dart
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  runApp(const PortafolioAdminApp());
}
```

---

## Estructura de Storage (lo que genera la API)

### Proyectos

```text
proyectos/
  {tipo}/                              ← movil | web | game_dev | automatizacion | ciberseguridad
    {titulo exacto del proyecto}/
      {titulo}_1.png
      {titulo}_2.png
```

**Ejemplo:**

```text
gs://portafoliodeibyramirez.firebasestorage.app/proyectos/automatizacion/Automatizacion PQR Correos Electronicos/Automatizacion PQR Correos Electronicos_1.png
```

### Certificados

```text
certificados/
  {titulo del certificado}/
    {titulo}_1.png
```

> El `titulo` define el nombre de la carpeta. Usa el titulo final antes de subir imagenes.

---

## Contrato multipart de la API

### Crear proyecto — `POST /api/proyectos`

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `data` | string JSON | Si | Metadata del proyecto |
| `imagenes` | file(s) | No* | Archivos PNG, JPG, WEBP o GIF |

\* Si envias imagenes, el JSON debe incluir `tipo` (categoria).

**Header obligatorio:**

```http
Authorization: Bearer TU_PORTFOLIO_API_KEY
```

**Ejemplo del campo `data`:**

```json
{
  "titulo": "Automatizacion PQR Correos Electronicos",
  "descripcion": "Flujo n8n para gestionar PQR por correo.",
  "tipo": "automatizacion",
  "repositorio": "https://github.com/usuario/repo",
  "lenguajes": ["JavaScript"],
  "frameworks": ["n8n"],
  "librerias": ["Gmail API"]
}
```

**Respuesta 201:** el proyecto con `id` e `imagenes[]` ya con rutas `gs://`.

### Actualizar proyecto — `PATCH /api/proyectos/:id`

| Campo extra | Descripcion |
| --- | --- |
| `imagenes` | Agrega fotos al final (`_3`, `_4`...) |
| `reemplazarImagenes` | `"true"` → borra las anteriores y renombra desde `_1` |

### Crear certificado — `POST /api/certificados`

| Campo | Tipo | Requerido |
| --- | --- | --- |
| `data` | string JSON | Si |
| `imagen` | file | Si (una sola) |

---

## Codigo Flutter — paso a paso

### Paso 1: Servicio API

`lib/services/portafolio_api.dart`

```dart
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiException implements Exception {
  final int statusCode;
  final String message;
  const ApiException(this.statusCode, this.message);
  @override
  String toString() => 'ApiException($statusCode): $message';
}

class PortafolioApi {
  PortafolioApi({
    String? baseUrl,
    String? apiKey,
  })  : baseUrl = baseUrl ?? dotenv.env['API_BASE_URL']!,
        apiKey = apiKey ?? dotenv.env['PORTFOLIO_API_KEY']!;

  final String baseUrl;
  final String apiKey;

  Future<dynamic> _handle(http.Response response) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.body.isEmpty ? null : jsonDecode(response.body);
    }
    String msg = 'Error desconocido';
    try {
      msg = (jsonDecode(response.body) as Map)['message'] ?? msg;
    } catch (_) {}
    throw ApiException(response.statusCode, msg);
  }

  /// GET publico — listar proyectos.
  Future<List<Map<String, dynamic>>> getProyectos() async {
    final res = await http.get(Uri.parse('$baseUrl/proyectos'));
    final data = await _handle(res) as List;
    return data.cast<Map<String, dynamic>>();
  }

  /// POST con imagenes — la API sube a Firebase Storage.
  Future<Map<String, dynamic>> crearProyecto({
    required Map<String, dynamic> data,
    required List<File> imagenes,
  }) async {
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/proyectos'));
    request.headers['Authorization'] = 'Bearer $apiKey';
    request.fields['data'] = jsonEncode(data);

    for (final img in imagenes) {
      request.files.add(await http.MultipartFile.fromPath('imagenes', img.path));
    }

    final response = await http.Response.fromStream(await request.send());
    return (await _handle(response) as Map).cast<String, dynamic>();
  }

  /// PATCH — agregar imagenes a proyecto existente.
  Future<Map<String, dynamic>> agregarImagenesProyecto({
    required String id,
    required List<File> imagenes,
    bool reemplazar = false,
  }) async {
    final request = http.MultipartRequest('PATCH', Uri.parse('$baseUrl/proyectos/$id'));
    request.headers['Authorization'] = 'Bearer $apiKey';
    request.fields['data'] = jsonEncode({});
    if (reemplazar) request.fields['reemplazarImagenes'] = 'true';

    for (final img in imagenes) {
      request.files.add(await http.MultipartFile.fromPath('imagenes', img.path));
    }

    final response = await http.Response.fromStream(await request.send());
    return (await _handle(response) as Map).cast<String, dynamic>();
  }

  /// POST certificado con imagen.
  Future<Map<String, dynamic>> crearCertificado({
    required Map<String, dynamic> data,
    required File imagen,
  }) async {
    final request = http.MultipartRequest('POST', Uri.parse('$baseUrl/certificados'));
    request.headers['Authorization'] = 'Bearer $apiKey';
    request.fields['data'] = jsonEncode(data);
    request.files.add(await http.MultipartFile.fromPath('imagen', imagen.path));

    final response = await http.Response.fromStream(await request.send());
    return (await _handle(response) as Map).cast<String, dynamic>();
  }
}
```

### Paso 2: Convertir gs:// para mostrar en pantalla

`lib/utils/firebase_url.dart`

```dart
class FirebaseUrl {
  static const bucket = 'portafoliodeibyramirez.firebasestorage.app';

  static String gsToHttps(String gsUrl) {
    if (gsUrl.startsWith('https://')) return gsUrl;
    const prefix = 'gs://portafoliodeibyramirez.firebasestorage.app/';
    final path = gsUrl
        .replaceFirst(prefix, '')
        .replaceAll('/', '%2F')
        .replaceAll(' ', '%20');
    return 'https://firebasestorage.googleapis.com/v0/b/$bucket/o/$path?alt=media';
  }
}
```

### Paso 3: Pantalla para seleccionar imagenes y crear proyecto

`lib/screens/crear_proyecto_screen.dart`

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/portafolio_api.dart';
import '../utils/firebase_url.dart';

class CrearProyectoScreen extends StatefulWidget {
  const CrearProyectoScreen({super.key});

  @override
  State<CrearProyectoScreen> createState() => _CrearProyectoScreenState();
}

class _CrearProyectoScreenState extends State<CrearProyectoScreen> {
  final _api = PortafolioApi();
  final _picker = ImagePicker();
  final _tituloCtrl = TextEditingController();
  final _descCtrl = TextEditingController();

  String _tipo = 'automatizacion';
  final List<File> _imagenesSeleccionadas = [];
  bool _guardando = false;

  Future<void> _elegirImagenes() async {
    final fotos = await _picker.pickMultiImage(imageQuality: 85);
    if (fotos.isEmpty) return;
    setState(() {
      _imagenesSeleccionadas.addAll(fotos.map((x) => File(x.path)));
    });
  }

  Future<void> _tomarFoto() async {
    final foto = await _picker.pickImage(source: ImageSource.camera, imageQuality: 85);
    if (foto == null) return;
    setState(() => _imagenesSeleccionadas.add(File(foto.path)));
  }

  Future<void> _guardar() async {
    if (_tituloCtrl.text.trim().isEmpty || _descCtrl.text.trim().isEmpty) {
      _mostrarError('Titulo y descripcion son obligatorios');
      return;
    }
    if (_imagenesSeleccionadas.isEmpty) {
      _mostrarError('Selecciona al menos una imagen');
      return;
    }

    setState(() => _guardando = true);
    try {
      final proyecto = await _api.crearProyecto(
        data: {
          'titulo': _tituloCtrl.text.trim(),
          'descripcion': _descCtrl.text.trim(),
          'tipo': _tipo,
          'lenguajes': <String>[],
          'frameworks': <String>[],
          'librerias': <String>[],
        },
        imagenes: _imagenesSeleccionadas,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Proyecto creado: ${proyecto['id']}')),
      );
      Navigator.pop(context, proyecto);
    } on ApiException catch (e) {
      _mostrarError(e.message);
    } catch (e) {
      _mostrarError('Error: $e');
    } finally {
      if (mounted) setState(() => _guardando = false);
    }
  }

  void _mostrarError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nuevo proyecto')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _tituloCtrl,
            decoration: const InputDecoration(labelText: 'Titulo del proyecto'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _descCtrl,
            maxLines: 4,
            decoration: const InputDecoration(labelText: 'Descripcion'),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _tipo,
            items: const [
              DropdownMenuItem(value: 'movil', child: Text('Movil')),
              DropdownMenuItem(value: 'web', child: Text('Web')),
              DropdownMenuItem(value: 'game_dev', child: Text('Game Dev')),
              DropdownMenuItem(value: 'automatizacion', child: Text('Automatizacion')),
              DropdownMenuItem(value: 'ciberseguridad', child: Text('Ciberseguridad')),
            ],
            onChanged: (v) => setState(() => _tipo = v!),
            decoration: const InputDecoration(labelText: 'Categoria'),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              ElevatedButton.icon(
                onPressed: _elegirImagenes,
                icon: const Icon(Icons.photo_library),
                label: const Text('Galeria'),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: _tomarFoto,
                icon: const Icon(Icons.camera_alt),
                label: const Text('Camara'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text('${_imagenesSeleccionadas.length} imagen(es) seleccionada(s)'),
          const SizedBox(height: 8),
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _imagenesSeleccionadas.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) => Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.file(_imagenesSeleccionadas[i], width: 100, height: 100, fit: BoxFit.cover),
                  ),
                  Positioned(
                    top: 0,
                    right: 0,
                    child: IconButton(
                      icon: const Icon(Icons.close, color: Colors.red),
                      onPressed: () => setState(() => _imagenesSeleccionadas.removeAt(i)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          FilledButton(
            onPressed: _guardando ? null : _guardar,
            child: _guardando
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Guardar proyecto'),
          ),
        ],
      ),
    );
  }
}
```

### Paso 4: Mostrar imagenes del portafolio (lectura)

```dart
// GET publico — no necesita API key
final proyectos = await PortafolioApi().getProyectos();

for (final p in proyectos) {
  final imagenes = (p['imagenes'] as List?)?.cast<String>() ?? [];
  for (final gs in imagenes) {
    final url = FirebaseUrl.gsToHttps(gs);
    // Image.network(url) o CachedNetworkImage(imageUrl: url)
  }
}
```

---

## Flujo completo en la app

```text
1. Usuario abre "Nuevo proyecto"
2. Escribe titulo, descripcion, elige categoria (tipo)
3. Toca "Galeria" o "Camara" → image_picker devuelve File(s)
4. Ve preview de las imagenes seleccionadas
5. Toca "Guardar"
6. App envia multipart:
     - fields['data'] = JSON
     - files['imagenes'] = archivos
7. API guarda en MongoDB → sube a Storage → responde con gs://
8. App muestra confirmacion o navega al detalle
```

---

## Errores comunes

| Error API | Causa | Solucion |
| --- | --- | --- |
| `401 No autorizado` | API key incorrecta o ausente | Revisa `PORTFOLIO_API_KEY` en `.env` y Vercel |
| `400 tipo es requerido` | Subiste imagenes sin categoria | Incluye `"tipo"` en el JSON de `data` |
| `500 Firebase no configurado` | Vercel sin credenciales Firebase | Agrega `FIREBASE_SERVICE_ACCOUNT_JSON` en Vercel |
| `Tipo de archivo no permitido` | Formato invalido | Usa PNG, JPG, WEBP o GIF |
| Connection refused | URL incorrecta en emulador | Android usa `10.0.2.2`, no `localhost` |

---

## Checklist de implementacion

- [ ] Crear proyecto Flutter con dependencias (`http`, `image_picker`, `flutter_dotenv`)
- [ ] Configurar `.env` con `API_BASE_URL` y `PORTFOLIO_API_KEY`
- [ ] Agregar permisos Android/iOS para galeria y camara
- [ ] Copiar `PortafolioApi` y `FirebaseUrl`
- [ ] Implementar pantalla con `ImagePicker` + preview + boton guardar
- [ ] Probar `POST /api/proyectos` con al menos 1 imagen
- [ ] Verificar en respuesta JSON que `imagenes[]` tiene rutas `gs://`
- [ ] Probar lectura con `GET /api/proyectos` y `FirebaseUrl.gsToHttps`
- [ ] Confirmar que el sitio web muestra el proyecto nuevo

---

## Endpoints rapidos

| Accion | Metodo | Ruta | Auth | Body |
| --- | --- | --- | --- | --- |
| Listar proyectos | GET | `/proyectos` | No | — |
| Crear proyecto + fotos | POST | `/proyectos` | Si | multipart: `data` + `imagenes` |
| Agregar fotos | PATCH | `/proyectos/:id` | Si | multipart: `imagenes` |
| Reemplazar fotos | PATCH | `/proyectos/:id` | Si | multipart + `reemplazarImagenes=true` |
| Crear certificado + foto | POST | `/certificados` | Si | multipart: `data` + `imagen` |
| Eliminar proyecto | DELETE | `/proyectos/:id` | Si | — |

---

## Seguridad

- No subas `.env` al repositorio.
- La API key da acceso total de escritura — usa la app solo para uso personal.
- `GET` es publico (solo lectura); no expone la key.

---

## Prueba rapida con curl (antes de Flutter)

```bash
curl -X POST https://TU-DOMINIO.vercel.app/api/proyectos \
  -H "Authorization: Bearer TU_API_KEY" \
  -F 'data={"titulo":"Test Flutter","descripcion":"Prueba","tipo":"web"}' \
  -F "imagenes=@C:/ruta/captura.png"
```

Si esto funciona, Flutter funcionara con el mismo formato multipart.
