const productCatalogSets = [ {
    id: 1,
    name: "box",
    image: "/images/sets/box.png",
    altImages: ["/images/sets/box1.png", "/images/sets/box3.png"],
 sample: ["/images/sample/grindbox2.webp", "/images/sample/grindbox.webp", ],
    designer: "СкейтДизайн",
    year: 2024,
     description2: "Міцний гриндбокс для відпрацювання слайдів і грайндів. Стійкий, рівний і зручний у транспортуванні — ідеальний елемент, щоб апгрейдити будь-який скейтспот.",
    description: "Пиши нам у месенджер або кидай заявку — ми зателефонуємо й усе обговоримо. Замов фігуру для скейтпарку під себе — міцну, надійну й готову до катки. Власне виробництво, ручна збірка, доставка по Україні.",
    details: [
      { title: "Каталог фигур", link: "#catalog" },
      
    ],
    relatedProducts: [1, 2, 4, 5] // IDs of related products
  },  {
    id: 3,
    name: "jumpbox",
           image: "/images/sets/box360/160yolobox1.png",
        altImages: [ "/images/sets/box360/160yolobox2.webp", "/images/sets/box360/160yolobox3.webp", "/images/sets/box360/160yolobox4.webp", 
          "/images/sets/box360/160yolobox5.webp","/images/sets/box360/160yolobox6.webp","/images/sets/box360/160yolobox7.webp",
          "/images/sets/box360/160yolobox8.webp","/images/sets/box360/160yolobox9.webp","/images/sets/box360/160yolobox10.webp",
           "/images/sets/box360/160yolobox11.webp", "/images/sets/box360/160yolobox12.webp", "/images/sets/box360/160yolobox13.webp", "/images/sets/box360/160yolobox14.webp",
          "/images/sets/box360/160yolobox15.webp", "/images/sets/box360/160yolobox16.webp", "/images/sets/box360/160yolobox17.webp", "/images/sets/box360/160yolobox18.webp", ],
    sample: ["/images/sample/jumpbox.jpg",  "/images/sample/jumpbox1.jpg", "/images/sample/jumpboxhatob.JPG" ],
    
         description2: "Професійний флайбокс для відпрацювання стрибкiв.",
    year: 2024,
    description: "Пиши нам у месенджер або кидай заявку — ми зателефонуємо й усе обговоримо. Замов фігуру для скейтпарку під себе — міцну, надійну й готову до катки. Власне виробництво, ручна збірка, доставка по Україні.",

    relatedProducts: [1, 3, 4, 5] // IDs of related products
  }, 
  
 
  // {
  //   id: 4,
  //   name: "manny",
  //    image: "/images/sets/manny.png",
//altImages: ["/images/sets/manny2.png", "/images/sets/manny.png"],
  //      sample: ["/images/sample/vertwall3.webp",  "/images/sample/vertwall1.webp" ],
 
  //   year: 2023,
  //   description2:"Плоска платформа для мануалів, ноллі, комбінованих технік. Вічна класика, яка повинна бути на кожному споті.",
  //   description: "Для тих, хто любить технічне катання та не боїться рутини. Купити мануалбокс — поставити перед собою виклик, який щодня нагадує, що є куди рости.Комплекты для самостоятельного строительства элементов.",
  //       // description2: "",
  //       details: [
  //       { title: "Каталог фигур", link: "#catalog" },
    
      
  //   ],
  //   relatedProducts: [1, 2, 3, 5] // IDs of related products
  // }, 
  {
    id: 5,
    name: "quater",
     image: "/images/sets/quaterr215h80w125d40.png",
    altImages: ["/images/sets/quaterr215h80w125d40left.png", "/images/sets/quaterr215h80w125d40top.png"],
     sample: ["/images/sample/quater.webp",  "/images/sample/box.webp",],
  
    year: 2023,
    description: "Комплекты для самостоятельного строительства элементов.",
      description2: "квотер - неотъемлемая часть любого парка, чаще всего устанавливается по обе стороны площадки и помогает сохранять инерцию на площадке. набирать скорость или гасить её. квотера могут быть любого размера и их можно использовать для  трюков, разного размера квотера можно совмещать друг с другом - усовершенствуя площадку и открывать новые опции для катания и выполнения трюков",
    details: [
        { title: "Каталог фигур", link: "#catalog" },


    ],
    relatedProducts: [1, 2, 3, 4] // IDs of related products
  },
  {id: 2,
    name: "box",
    image: "/images/sets/kicker2.png",
    altImages: ["/images/160yolobox1.jpg", "/images/160yolobox1.jpg", "/images/160yolobox1.jpg", "/images/160yolobox1.jpg", "/images/160yolobox1.jpg","/images/160yolobox1.jpg","/images/160yolobox1.jpg","/images/160yolobox1.jpg","/images/160yolobox1.jpg","/images/160yolobox1..jpg", "/images/160yolobox1..jpg", "/images/160yolobox1..jpg",  ],
    sample: ["/images/sample/kicker1.webp", ],
 
    year: 2023,
    description: "Пиши нам у месенджер або кидай заявку — ми зателефонуємо й усе обговоримо. Замов фігуру для скейтпарку під себе — міцну, надійну й готову до катки. Власне виробництво, ручна збірка, доставка по Україні.",
     description2: "Всі фігури зроблені в Україні, для українських умов. Дощ, сонце, мороз — їм по барабану. Мiцна фанера, покриття, яке не відпускає. Доставка туди, де ти збираєш свою банду.Не чекай ідеального парку — створи його сам. Фігура за фігурою. Трюк за трюком.",
    // details: [
    //  { title: "побудовані фігури", link: "#catalog" },
    // ],
    relatedProducts: [2, 3, 4, 5] // IDs of related products
  },
]  ;
export default productCatalogSets