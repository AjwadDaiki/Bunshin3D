type FAQItem = {
  question: string;
  answer: string;
};

export function generateFAQSchema(items: FAQItem[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function getFAQDataForLocale(locale: string): FAQItem[] {
  const faqMap: Record<string, FAQItem[]> = {
    en: faqDataEN,
    fr: faqDataFR,
    es: faqDataES,
    de: faqDataDE,
    ja: faqDataJA,
    zh: faqDataZH,
  };
  return faqMap[locale] || faqDataEN;
}

export const faqDataEN: FAQItem[] = [
  {
    question: "How does Bunshin 3D convert images to 3D models?",
    answer: "Bunshin 3D uses advanced AI neural networks to analyze your 2D images and reconstruct them into full 3D models. Our Trellis Engine extracts depth information, textures, and geometry from any image, then generates production-ready GLB or STL files in under 30 seconds.",
  },
  {
    question: "What file formats can I export my 3D models to?",
    answer: "Bunshin 3D supports multiple export formats including GLB (ideal for web, AR, and game engines like Unity/Unreal), STL (perfect for 3D printing), OBJ, and FBX. All exports include optimized topology suitable for professional use.",
  },
  {
    question: "Is Bunshin 3D free to use?",
    answer: "Yes! You can start creating 3D models for free. We offer a credit-based system where you purchase credits as needed. Prices start at €2.99 for 10 credits, with no monthly subscription required and credits that never expire.",
  },
  {
    question: "Can I use my generated 3D models commercially?",
    answer: "Absolutely. All 3D models you generate with Bunshin 3D come with a full commercial license. You can use them in games, 3D printing products for sale, marketing materials, and any other commercial application.",
  },
  {
    question: "What types of images work best for 3D conversion?",
    answer: "For best results, use clear images with good lighting and a simple background. Logos, product photos, character artwork, and drawings all work excellently. Our AI handles PNG, JPG, and WEBP formats up to 10MB.",
  },
  {
    question: "How long does it take to generate a 3D model?",
    answer: "Standard quality models are generated in approximately 30 seconds. Premium quality models with photorealistic textures take around 2 minutes. Our GPU cluster ensures fast, reliable processing.",
  },
];

export const faqDataFR: FAQItem[] = [
  {
    question: "Comment Bunshin 3D convertit-il les images en modèles 3D ?",
    answer: "Bunshin 3D utilise des réseaux neuronaux IA avancés pour analyser vos images 2D et les reconstruire en modèles 3D complets. Notre moteur Trellis extrait les informations de profondeur, les textures et la géométrie de n'importe quelle image, puis génère des fichiers GLB ou STL prêts pour la production en moins de 30 secondes.",
  },
  {
    question: "Quels formats de fichiers puis-je exporter pour mes modèles 3D ?",
    answer: "Bunshin 3D prend en charge plusieurs formats d'exportation dont GLB (idéal pour le web, la RA et les moteurs de jeu comme Unity/Unreal), STL (parfait pour l'impression 3D), OBJ et FBX. Toutes les exportations incluent une topologie optimisée adaptée à un usage professionnel.",
  },
  {
    question: "Bunshin 3D est-il gratuit ?",
    answer: "Oui ! Vous pouvez commencer à créer des modèles 3D gratuitement. Nous proposons un système de crédits où vous achetez des crédits selon vos besoins. Les prix commencent à 2,99€ pour 10 crédits, sans abonnement mensuel et les crédits n'expirent jamais.",
  },
  {
    question: "Puis-je utiliser mes modèles 3D générés à des fins commerciales ?",
    answer: "Absolument. Tous les modèles 3D que vous générez avec Bunshin 3D sont accompagnés d'une licence commerciale complète. Vous pouvez les utiliser dans des jeux, des produits d'impression 3D destinés à la vente, des supports marketing et toute autre application commerciale.",
  },
  {
    question: "Quels types d'images fonctionnent le mieux pour la conversion 3D ?",
    answer: "Pour de meilleurs résultats, utilisez des images nettes avec un bon éclairage et un fond simple. Les logos, photos de produits, illustrations de personnages et dessins fonctionnent tous excellemment. Notre IA gère les formats PNG, JPG et WEBP jusqu'à 10 Mo.",
  },
  {
    question: "Combien de temps faut-il pour générer un modèle 3D ?",
    answer: "Les modèles de qualité standard sont générés en environ 30 secondes. Les modèles de qualité premium avec des textures photoréalistes prennent environ 2 minutes. Notre cluster GPU assure un traitement rapide et fiable.",
  },
];

export const faqDataES: FAQItem[] = [
  {
    question: "¿Cómo convierte Bunshin 3D las imágenes en modelos 3D?",
    answer: "Bunshin 3D utiliza redes neuronales de IA avanzadas para analizar tus imágenes 2D y reconstruirlas en modelos 3D completos. Nuestro Motor Trellis extrae información de profundidad, texturas y geometría de cualquier imagen, generando archivos GLB o STL listos para producción en menos de 30 segundos.",
  },
  {
    question: "¿A qué formatos puedo exportar mis modelos 3D?",
    answer: "Bunshin 3D soporta múltiples formatos de exportación incluyendo GLB (ideal para web, AR y motores de juego como Unity/Unreal), STL (perfecto para impresión 3D), OBJ y FBX. Todas las exportaciones incluyen topología optimizada para uso profesional.",
  },
  {
    question: "¿Es Bunshin 3D gratuito?",
    answer: "¡Sí! Puedes comenzar a crear modelos 3D gratis. Ofrecemos un sistema de créditos donde compras según necesites. Los precios comienzan en 2,99€ por 10 créditos, sin suscripción mensual y los créditos nunca expiran.",
  },
  {
    question: "¿Puedo usar mis modelos 3D generados comercialmente?",
    answer: "Absolutamente. Todos los modelos 3D que generes con Bunshin 3D incluyen licencia comercial completa. Puedes usarlos en juegos, productos de impresión 3D para venta, materiales de marketing y cualquier aplicación comercial.",
  },
  {
    question: "¿Qué tipos de imágenes funcionan mejor para la conversión 3D?",
    answer: "Para mejores resultados, usa imágenes claras con buena iluminación y fondo simple. Logos, fotos de productos, ilustraciones de personajes y dibujos funcionan excelentemente. Nuestra IA maneja formatos PNG, JPG y WEBP hasta 10MB.",
  },
  {
    question: "¿Cuánto tiempo toma generar un modelo 3D?",
    answer: "Los modelos de calidad estándar se generan en aproximadamente 30 segundos. Los modelos premium con texturas fotorrealistas toman alrededor de 2 minutos. Nuestro cluster GPU asegura procesamiento rápido y confiable.",
  },
];

export const faqDataDE: FAQItem[] = [
  {
    question: "Wie konvertiert Bunshin 3D Bilder in 3D-Modelle?",
    answer: "Bunshin 3D verwendet fortschrittliche KI-Neuronale Netzwerke, um Ihre 2D-Bilder zu analysieren und sie in vollständige 3D-Modelle zu rekonstruieren. Unsere Trellis Engine extrahiert Tiefeninformationen, Texturen und Geometrie aus jedem Bild und generiert produktionsreife GLB- oder STL-Dateien in unter 30 Sekunden.",
  },
  {
    question: "In welche Dateiformate kann ich meine 3D-Modelle exportieren?",
    answer: "Bunshin 3D unterstützt mehrere Exportformate einschließlich GLB (ideal für Web, AR und Game-Engines wie Unity/Unreal), STL (perfekt für 3D-Druck), OBJ und FBX. Alle Exporte beinhalten optimierte Topologie für professionellen Einsatz.",
  },
  {
    question: "Ist Bunshin 3D kostenlos?",
    answer: "Ja! Sie können kostenlos mit der Erstellung von 3D-Modellen beginnen. Wir bieten ein Creditsystem, bei dem Sie Credits nach Bedarf kaufen. Die Preise beginnen bei 2,99€ für 10 Credits, ohne monatliches Abo und Credits verfallen nie.",
  },
  {
    question: "Kann ich meine generierten 3D-Modelle kommerziell nutzen?",
    answer: "Absolut. Alle 3D-Modelle, die Sie mit Bunshin 3D generieren, beinhalten eine vollständige kommerzielle Lizenz. Sie können sie in Spielen, 3D-Druckprodukten zum Verkauf, Marketingmaterialien und jeder anderen kommerziellen Anwendung verwenden.",
  },
  {
    question: "Welche Bildtypen funktionieren am besten für die 3D-Konvertierung?",
    answer: "Für beste Ergebnisse verwenden Sie klare Bilder mit guter Beleuchtung und einfachem Hintergrund. Logos, Produktfotos, Charakter-Artwork und Zeichnungen funktionieren alle ausgezeichnet. Unsere KI verarbeitet PNG, JPG und WEBP Formate bis zu 10MB.",
  },
  {
    question: "Wie lange dauert die Generierung eines 3D-Modells?",
    answer: "Standardqualitätsmodelle werden in etwa 30 Sekunden generiert. Premiumqualitätsmodelle mit fotorealistischen Texturen dauern etwa 2 Minuten. Unser GPU-Cluster gewährleistet schnelle, zuverlässige Verarbeitung.",
  },
];

export const faqDataJA: FAQItem[] = [
  {
    question: "Bunshin 3Dはどのように画像を3Dモデルに変換しますか？",
    answer: "Bunshin 3Dは高度なAIニューラルネットワークを使用して2D画像を分析し、完全な3Dモデルに再構築します。Trellisエンジンは任意の画像から深度情報、テクスチャ、ジオメトリを抽出し、30秒以内にプロダクション対応のGLBまたはSTLファイルを生成します。",
  },
  {
    question: "3Dモデルをどのファイル形式にエクスポートできますか？",
    answer: "Bunshin 3DはGLB（Web、AR、Unity/Unrealなどのゲームエンジンに最適）、STL（3Dプリントに最適）、OBJ、FBXを含む複数のエクスポート形式をサポートしています。すべてのエクスポートにはプロフェッショナル使用に適した最適化されたトポロジーが含まれています。",
  },
  {
    question: "Bunshin 3Dは無料で使えますか？",
    answer: "はい！無料で3Dモデルの作成を開始できます。必要に応じてクレジットを購入するクレジットベースのシステムを提供しています。価格は10クレジットで2.99€から始まり、月額サブスクリプションは不要で、クレジットは無期限です。",
  },
  {
    question: "生成した3Dモデルを商用利用できますか？",
    answer: "もちろんです。Bunshin 3Dで生成したすべての3Dモデルには完全な商用ライセンスが付属しています。ゲーム、販売用3Dプリント製品、マーケティング資料、その他の商用アプリケーションで使用できます。",
  },
  {
    question: "3D変換に最適な画像の種類は何ですか？",
    answer: "最良の結果を得るには、良好な照明とシンプルな背景を持つ鮮明な画像を使用してください。ロゴ、製品写真、キャラクターアートワーク、イラストはすべて優れた結果が得られます。AIはPNG、JPG、WEBP形式を最大10MBまでサポートしています。",
  },
  {
    question: "3Dモデルの生成にはどのくらい時間がかかりますか？",
    answer: "標準品質のモデルは約30秒で生成されます。フォトリアルなテクスチャを持つプレミアム品質のモデルは約2分かかります。GPUクラスターにより高速で信頼性の高い処理を保証します。",
  },
];

export const faqDataZH: FAQItem[] = [
  {
    question: "Bunshin 3D如何将图像转换为3D模型？",
    answer: "Bunshin 3D使用先进的AI神经网络来分析您的2D图像并将其重建为完整的3D模型。我们的Trellis引擎从任何图像中提取深度信息、纹理和几何形状，然后在30秒内生成生产就绪的GLB或STL文件。",
  },
  {
    question: "我可以将3D模型导出为哪些文件格式？",
    answer: "Bunshin 3D支持多种导出格式，包括GLB（适合网络、AR和Unity/Unreal等游戏引擎）、STL（完美用于3D打印）、OBJ和FBX。所有导出都包含适合专业使用的优化拓扑。",
  },
  {
    question: "Bunshin 3D是免费的吗？",
    answer: "是的！您可以免费开始创建3D模型。我们提供按需购买积分的系统。价格从10积分2.99欧元起，无需月度订阅，积分永不过期。",
  },
  {
    question: "我可以商业使用生成的3D模型吗？",
    answer: "当然可以。您使用Bunshin 3D生成的所有3D模型都附带完整的商业许可。您可以将它们用于游戏、销售的3D打印产品、营销材料以及任何其他商业应用。",
  },
  {
    question: "哪种类型的图像最适合3D转换？",
    answer: "为获得最佳效果，请使用具有良好照明和简单背景的清晰图像。徽标、产品照片、角色艺术作品和绘图都能获得出色的效果。我们的AI支持最大10MB的PNG、JPG和WEBP格式。",
  },
  {
    question: "生成3D模型需要多长时间？",
    answer: "标准质量模型大约30秒生成。具有照片级真实纹理的高级质量模型大约需要2分钟。我们的GPU集群确保快速、可靠的处理。",
  },
];
