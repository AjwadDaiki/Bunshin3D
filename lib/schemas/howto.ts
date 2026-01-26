type HowToData = {
  name: string;
  description: string;
  tools: { browser: string; image: string };
  steps: { name: string; text: string }[];
};

const howToDataMap: Record<string, HowToData> = {
  en: {
    name: "How to Convert an Image to a 3D Model Using AI",
    description: "Learn how to transform any 2D image, logo, or drawing into a production-ready 3D model (STL, GLB) using Bunshin 3D's AI-powered conversion tool in under 60 seconds.",
    tools: {
      browser: "Web Browser (Chrome, Firefox, Safari)",
      image: "PNG, JPG, or WEBP image file",
    },
    steps: [
      { name: "Upload Your Image", text: "Go to the Bunshin 3D Studio and drag & drop your PNG, JPG, or WEBP image into the upload zone. You can use any image: logos, photos, drawings, or artwork. The maximum file size is 10MB." },
      { name: "AI Processing", text: "Our Trellis AI Engine will automatically analyze your image, extract depth information, and reconstruct the 3D geometry. This process takes approximately 30 seconds for standard quality." },
      { name: "Download Your 3D Model", text: "Once processing is complete, download your 3D model in GLB format (for games and web) or STL format (for 3D printing). The model includes optimized topology ready for professional use." },
    ],
  },
  fr: {
    name: "Comment Convertir une Image en Modèle 3D avec l'IA",
    description: "Apprenez à transformer n'importe quelle image 2D, logo ou dessin en modèle 3D prêt pour la production (STL, GLB) en utilisant l'outil de conversion IA de Bunshin 3D en moins de 60 secondes.",
    tools: {
      browser: "Navigateur Web (Chrome, Firefox, Safari)",
      image: "Fichier image PNG, JPG ou WEBP",
    },
    steps: [
      { name: "Téléchargez Votre Image", text: "Accédez au Studio Bunshin 3D et glissez-déposez votre image PNG, JPG ou WEBP dans la zone de téléchargement. Vous pouvez utiliser n'importe quelle image : logos, photos, dessins ou illustrations. La taille maximale est de 10 Mo." },
      { name: "Traitement par l'IA", text: "Notre moteur IA Trellis analysera automatiquement votre image, extraira les informations de profondeur et reconstruira la géométrie 3D. Ce processus prend environ 30 secondes en qualité standard." },
      { name: "Téléchargez Votre Modèle 3D", text: "Une fois le traitement terminé, téléchargez votre modèle 3D au format GLB (pour les jeux et le web) ou STL (pour l'impression 3D). Le modèle inclut une topologie optimisée prête pour un usage professionnel." },
    ],
  },
  es: {
    name: "Cómo Convertir una Imagen en Modelo 3D con IA",
    description: "Aprende a transformar cualquier imagen 2D, logo o dibujo en un modelo 3D listo para producción (STL, GLB) usando la herramienta de conversión IA de Bunshin 3D en menos de 60 segundos.",
    tools: {
      browser: "Navegador Web (Chrome, Firefox, Safari)",
      image: "Archivo de imagen PNG, JPG o WEBP",
    },
    steps: [
      { name: "Sube Tu Imagen", text: "Ve al Studio Bunshin 3D y arrastra y suelta tu imagen PNG, JPG o WEBP en la zona de carga. Puedes usar cualquier imagen: logos, fotos, dibujos o ilustraciones. El tamaño máximo es 10MB." },
      { name: "Procesamiento IA", text: "Nuestro Motor IA Trellis analizará automáticamente tu imagen, extraerá información de profundidad y reconstruirá la geometría 3D. Este proceso toma aproximadamente 30 segundos en calidad estándar." },
      { name: "Descarga Tu Modelo 3D", text: "Una vez completado el procesamiento, descarga tu modelo 3D en formato GLB (para juegos y web) o formato STL (para impresión 3D). El modelo incluye topología optimizada lista para uso profesional." },
    ],
  },
  de: {
    name: "Wie man ein Bild mit KI in ein 3D-Modell konvertiert",
    description: "Erfahren Sie, wie Sie jedes 2D-Bild, Logo oder Zeichnung in ein produktionsreifes 3D-Modell (STL, GLB) mit dem KI-gestützten Konvertierungstool von Bunshin 3D in unter 60 Sekunden umwandeln.",
    tools: {
      browser: "Webbrowser (Chrome, Firefox, Safari)",
      image: "PNG, JPG oder WEBP Bilddatei",
    },
    steps: [
      { name: "Laden Sie Ihr Bild hoch", text: "Gehen Sie zum Bunshin 3D Studio und ziehen Sie Ihr PNG, JPG oder WEBP Bild per Drag & Drop in den Upload-Bereich. Sie können jedes Bild verwenden: Logos, Fotos, Zeichnungen oder Artwork. Die maximale Dateigröße beträgt 10MB." },
      { name: "KI-Verarbeitung", text: "Unsere Trellis KI-Engine wird Ihr Bild automatisch analysieren, Tiefeninformationen extrahieren und die 3D-Geometrie rekonstruieren. Dieser Prozess dauert etwa 30 Sekunden bei Standardqualität." },
      { name: "Laden Sie Ihr 3D-Modell herunter", text: "Nach Abschluss der Verarbeitung laden Sie Ihr 3D-Modell im GLB-Format (für Spiele und Web) oder STL-Format (für 3D-Druck) herunter. Das Modell enthält optimierte Topologie, bereit für professionelle Nutzung." },
    ],
  },
  ja: {
    name: "AIを使って画像を3Dモデルに変換する方法",
    description: "Bunshin 3DのAI搭載変換ツールを使用して、任意の2D画像、ロゴ、またはイラストを60秒以内にプロダクション対応の3Dモデル（STL、GLB）に変換する方法を学びましょう。",
    tools: {
      browser: "ウェブブラウザ（Chrome、Firefox、Safari）",
      image: "PNG、JPG、またはWEBP画像ファイル",
    },
    steps: [
      { name: "画像をアップロード", text: "Bunshin 3D Studioにアクセスし、PNG、JPG、またはWEBP画像をアップロードゾーンにドラッグ＆ドロップします。ロゴ、写真、イラスト、アートワークなど、どんな画像でも使用できます。最大ファイルサイズは10MBです。" },
      { name: "AI処理", text: "Trellis AIエンジンが自動的に画像を分析し、深度情報を抽出し、3Dジオメトリを再構築します。このプロセスは標準品質で約30秒かかります。" },
      { name: "3Dモデルをダウンロード", text: "処理が完了したら、GLB形式（ゲームとウェブ用）またはSTL形式（3Dプリント用）で3Dモデルをダウンロードします。モデルにはプロフェッショナル使用に対応した最適化されたトポロジーが含まれています。" },
    ],
  },
  zh: {
    name: "如何使用AI将图像转换为3D模型",
    description: "学习如何使用Bunshin 3D的AI转换工具在60秒内将任何2D图像、徽标或绘图转换为生产就绪的3D模型（STL、GLB）。",
    tools: {
      browser: "网络浏览器（Chrome、Firefox、Safari）",
      image: "PNG、JPG或WEBP图像文件",
    },
    steps: [
      { name: "上传您的图像", text: "前往Bunshin 3D Studio，将PNG、JPG或WEBP图像拖放到上传区域。您可以使用任何图像：徽标、照片、绘图或艺术作品。最大文件大小为10MB。" },
      { name: "AI处理", text: "我们的Trellis AI引擎将自动分析您的图像、提取深度信息并重建3D几何形状。标准质量下此过程大约需要30秒。" },
      { name: "下载您的3D模型", text: "处理完成后，以GLB格式（用于游戏和网络）或STL格式（用于3D打印）下载您的3D模型。模型包含适合专业使用的优化拓扑。" },
    ],
  },
};

export function generateHowToSchema(locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunshin3d.com";
  const data = howToDataMap[locale] || howToDataMap.en;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    description: data.description,
    image: `${baseUrl}/og-image.jpg`,
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: "0",
    },
    supply: [],
    tool: [
      { "@type": "HowToTool", name: data.tools.browser },
      { "@type": "HowToTool", name: data.tools.image },
    ],
    step: data.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${baseUrl}/${locale}#step-${index + 1}`,
    })),
  };
}
