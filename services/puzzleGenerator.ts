
import { Puzzle, PuzzleType, Difficulty, PuzzleOption, BalanceData, SymbolEquationData, Language } from '../types';

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export class QuestionGenerator {
  
  static generateAnalyticGeo(difficulty: Difficulty, lang: Language): Puzzle {
    let x1, y1, x2, y2;
    let questionText, correctAnswer, explanation;
    const isMidpoint = difficulty === 'Easy';

    if (isMidpoint) {
        x1 = randomInt(2, 20) * 2; 
        y1 = randomInt(2, 20) * 2;
        x2 = randomInt(2, 20) * 2;
        y2 = randomInt(2, 20) * 2;
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        questionText = lang === 'en'
          ? `Find the midpoint of points A(${x1}, ${y1}) and B(${x2}, ${y2}).`
          : `A(${x1}, ${y1}) ve B(${x2}, ${y2}) noktalarının orta noktası aşağıdakilerden hangisidir?`;
          
        correctAnswer = `(${midX}, ${midY})`;
        
        explanation = lang === 'en'
          ? `Midpoint Formula: ((x1+x2)/2, (y1+y2)/2).\nX: (${x1}+${x2})/2 = ${midX}.\nY: (${y1}+${y2})/2 = ${midY}.`
          : `Orta nokta formülü: ((x1+x2)/2, (y1+y2)/2).\nX: (${x1}+${x2})/2 = ${midX}.\nY: (${y1}+${y2})/2 = ${midY}.`;

    } else {
        const triples = [[3,4,5], [6,8,10], [5,12,13], [8,15,17]];
        const t = triples[randomInt(0, triples.length - 1)];
        const dx = Math.random() > 0.5 ? t[0] : t[1];
        const dy = dx === t[0] ? t[1] : t[0];
        
        x1 = randomInt(5, 15);
        y1 = randomInt(5, 15);
        x2 = x1 + dx;
        y2 = y1 + dy;
        
        questionText = lang === 'en'
          ? `What is the distance between points A(${x1}, ${y1}) and B(${x2}, ${y2})?`
          : `A(${x1}, ${y1}) ve B(${x2}, ${y2}) noktaları arasındaki uzaklık kaç birimdir?`;

        correctAnswer = `${t[2]} ${lang === 'en' ? 'units' : 'br'}`;
        
        explanation = lang === 'en'
          ? `Distance Formula: √((x2-x1)² + (y2-y1)²).\n√(${dx}² + ${dy}²) = √(${dx*dx} + ${dy*dy}) = ${t[2]}.`
          : `Uzaklık formülü: √((x2-x1)² + (y2-y1)²).\n√(${dx}² + ${dy}²) = √(${dx*dx} + ${dy*dy}) = ${t[2]}.`;
    }

    const correctOptionId = `geo-correct`;
    let options: PuzzleOption[] = [{ id: correctOptionId, value: correctAnswer }];
    
    for(let i=0; i<4; i++) {
        if (isMidpoint) {
           options.push({ id: `geo-${i}`, value: `(${randomInt(2,20)}, ${randomInt(2,20)})` });
        } else {
           const numVal = parseInt(correctAnswer as string);
           const fake = numVal + randomInt(1,5) * (Math.random() > 0.5 ? 1 : -1);
           if (fake > 0 && fake !== numVal) options.push({ id: `geo-${i}`, value: `${fake} ${lang === 'en' ? 'units' : 'br'}` });
        }
    }
    
    return {
        id: `geo-${Date.now()}`,
        type: PuzzleType.ANALYTIC_GEO,
        category: 'NUMERICAL',
        difficulty,
        data: { 
            text: questionText, 
            subText: isMidpoint 
                ? (lang === 'en' ? "Midpoint Formula" : "Orta Nokta Formülü") 
                : (lang === 'en' ? "Distance Formula" : "Uzaklık Formülü")
        },
        question: lang === 'en' ? "Solve Geometry Problem" : "Geometri Problemini Çözün",
        options: shuffle(options).slice(0,5),
        correctOptionId,
        explanation
    };
  }

  static generateWordProblem(difficulty: Difficulty, lang: Language): Puzzle {
    const names = shuffle(['Ali', 'Ayşe', 'Mehmet', 'Zeynep', 'Can', 'Elif']);
    const n1 = names[0];
    const n2 = names[1];
    
    let questionText, correctAnswer, explanation;

    if (difficulty === 'Easy') {
        const diff = randomInt(4, 20);
        const age2 = randomInt(10, 30);
        const age1 = age2 + diff;
        
        questionText = lang === 'en'
          ? `${n1} is ${diff} years older than ${n2}. If ${n2} is ${age2} years old, what is the sum of their ages?`
          : `${n1}, ${n2}'den ${diff} yaş büyüktür. ${n2} ${age2} yaşında olduğuna göre, ikisinin yaşları toplamı kaçtır?`;
        
        correctAnswer = age1 + age2;
        
        explanation = lang === 'en'
          ? `Step 1: ${n2} = ${age2}.\nStep 2: ${n1} = ${age2} + ${diff} = ${age1}.\nStep 3: Sum = ${age1} + ${age2} = ${age1+age2}.`
          : `Adım 1: ${n2} = ${age2}.\nAdım 2: ${n1} = ${age2} + ${diff} = ${age1}.\nAdım 3: Toplam = ${age1} + ${age2} = ${age1+age2}.`;
    } else {
        const ratio = randomInt(2, 4);
        const age2 = randomInt(5, 15); 
        const age1 = age2 * ratio;     
        const total = age1 + age2;
        
        questionText = lang === 'en'
          ? `The sum of ${n1} and ${n2}'s ages is ${total}. ${n1} is ${ratio} times as old as ${n2}. How old is ${n1}?`
          : `${n1} ve ${n2}'nin yaşları toplamı ${total} tür. ${n1}'nin yaşı ${n2}'nin yaşının ${ratio} katı olduğuna göre, ${n1} kaç yaşındadır?`;
          
        correctAnswer = age1;
        
        explanation = lang === 'en'
          ? `Step 1: Let ${n2} = x, so ${n1} = ${ratio}x.\nStep 2: Sum = x + ${ratio}x = ${ratio+1}x = ${total}.\nStep 3: x = ${age2} (${n2}).\nStep 4: ${n1} = ${ratio} * ${age2} = ${age1}.`
          : `Adım 1: ${n2} = x dersek, ${n1} = ${ratio}x olur.\nAdım 2: Toplam = ${ratio+1}x = ${total}.\nAdım 3: x = ${age2} (${n2}).\nAdım 4: ${n1} = ${ratio} * ${age2} = ${age1}.`;
    }

    const correctOptionId = `word-correct`;
    let options: PuzzleOption[] = [{ id: correctOptionId, value: correctAnswer }];
    
    options.push({ id: 'd1', value: correctAnswer + randomInt(1,3) });
    options.push({ id: 'd2', value: correctAnswer - randomInt(1,3) });
    options.push({ id: 'd3', value: difficulty === 'Easy' ? correctAnswer + 10 : Math.floor(correctAnswer / 2) });
    options.push({ id: 'd4', value: correctAnswer + 5 });

    return {
        id: `word-${Date.now()}`,
        type: PuzzleType.WORD_PROBLEM,
        category: 'LOGIC',
        difficulty,
        data: { text: questionText },
        question: lang === 'en' ? "Solve the Problem" : "Problemi Çözünüz",
        options: shuffle(options).slice(0,5),
        correctOptionId,
        explanation
    };
  }

  static generateTriangleMath(difficulty: Difficulty, lang: Language): Puzzle {
    let tMin, tMax, rules;
    
    if (difficulty === 'Easy') {
      tMin = 2; tMax = 9;
      rules = [
        { desc: "(Top + Left) - Right = Center", tr: "(Üst + Sol) - Sağ = Orta", calc: (t: any, l: any, r: any) => (t + l) - r },
        { desc: "Top + Left + Right = Center", tr: "Üst + Sol + Sağ = Orta", calc: (t: any, l: any, r: any) => t + l + r }
      ];
    } else if (difficulty === 'Medium') {
      tMin = 4; tMax = 15;
      rules = [
        { desc: "(Top * Left) + Right = Center", tr: "(Üst x Sol) + Sağ = Orta", calc: (t: any, l: any, r: any) => (t * l) + r },
        { desc: "|Top - Right| * Left = Center", tr: "|Üst - Sağ| x Sol = Orta", calc: (t: any, l: any, r: any) => Math.abs(t - r) * l }
      ];
    } else {
      tMin = 10; tMax = 50;
      rules = [
        { desc: "(Top + Left + Right) * 2 = Center", tr: "(Üst + Sol + Sağ) x 2 = Orta", calc: (t: any, l: any, r: any) => (t + l + r) * 2 },
        { desc: "(Top * Right) - (Left * 2) = Center", tr: "(Üst x Sağ) - (Sol x 2) = Orta", calc: (t: any, l: any, r: any) => (t * r) - (l * 2) }
      ];
    }

    const selectedRule = rules[randomInt(0, rules.length - 1)];
    const ruleText = lang === 'tr' ? selectedRule.tr : selectedRule.desc;

    let t, l, r, center;
    let retries = 0;
    do {
      t = randomInt(tMin, tMax);
      l = randomInt(tMin, tMax);
      r = randomInt(tMin, tMax);
      center = selectedRule.calc(t, l, r);
      retries++;
    } while ((center < 1 || center > 999) && retries < 20);

    const correctAnswer = center;
    const optionsList: number[] = [correctAnswer];
    while(optionsList.length < 5) {
      const fill = correctAnswer + randomInt(5, 20) * (Math.random() > 0.5 ? 1 : -1);
      if(fill > 0 && !optionsList.includes(fill)) optionsList.push(fill);
    }

    const shuffledValues = shuffle(optionsList);
    const correctOptionId = `opt-${shuffledValues.indexOf(correctAnswer)}`;
    const options: PuzzleOption[] = shuffledValues.map((val, idx) => ({
      id: `opt-${idx}`,
      value: val
    }));

    return {
      id: `tri-${Date.now()}`,
      type: PuzzleType.TRIANGLE_MATH,
      category: 'NUMERICAL',
      difficulty,
      data: { top: t, left: l, right: r, center: '?', ruleDescription: ruleText },
      question: lang === 'en' ? "Which number replaces the question mark?" : "Soru işareti yerine hangi sayı gelmelidir?",
      options,
      correctOptionId,
      explanation: `${lang === 'en' ? 'Rule' : 'Kural'}: ${ruleText}. (${t}, ${l}, ${r}) -> ${center}.`
    };
  }

  static generateMatrixLogic(difficulty: Difficulty, lang: Language): Puzzle {
     const base = randomInt(0, 3);
     const step = difficulty === 'Easy' ? 1 : (difficulty === 'Medium' ? -1 : 2);
     
     const grid: number[][] = [[0,0,0],[0,0,0],[0,0,0]];
     
     for(let row=0; row<3; row++) {
       for(let col=0; col<3; col++) {
         const sequenceIndex = row * 3 + col;
         let val = (base + sequenceIndex * step) % 4;
         if (val < 0) val += 4;
         grid[row][col] = val; 
       }
     }

     const correctAnswer = grid[2][2]; 
     grid[2][2] = -1; 

     const optionsList: number[] = [0, 1, 2, 3]; 
     const options: PuzzleOption[] = optionsList.map((val) => ({
        id: `mat-${val}`,
        value: val 
     }));
     
     const correctOptionId = `mat-${correctAnswer}`;
     
     const stepDesc = lang === 'en' 
        ? (step === 1 ? "90° clockwise" : (step === -1 ? "90° counter-clockwise" : "180°"))
        : (step === 1 ? "saat yönünde 90°" : (step === -1 ? "saat tersi yönünde 90°" : "180°"));

     return {
       id: `mat-${Date.now()}`,
       type: PuzzleType.MATRIX_LOGIC,
       category: 'VISUAL',
       difficulty,
       data: { grid, rotation: 0, shapeType: 'arrow' },
       question: lang === 'en' ? "Which shape completes the sequence?" : "Diziyi tamamlayan şekil hangisidir?",
       options,
       correctOptionId,
       explanation: lang === 'en' 
        ? `Shapes rotate ${stepDesc} at each step.` 
        : `Şekiller her adımda ${stepDesc} dönmektedir.`
     };
  }

  static generateBalanceScale(difficulty: Difficulty, lang: Language): Puzzle {
    const shapes = ['square', 'circle', 'triangle', 'diamond'];
    const shapesMap = shuffle(['square', 'circle', 'triangle']);
    const A = shapesMap[0];
    const B = shapesMap[1];
    const C = shapesMap[2];

    let data: BalanceData;
    let options: PuzzleOption[] = [];
    let correctId = "";
    let explanation = "";

    if (difficulty === 'Easy') {
      data = {
        scales: [
          { left: [{shape: A, count: 1}], right: [{shape: B, count: 2}] }, 
          { left: [{shape: B, count: 1}], right: [{shape: C, count: 2}] } 
        ],
        question: { left: [{shape: A, count: 1}] } 
      };
      // Ans: 4 C
      options = [
        { id: 'opt-0', value: 3, visualData: { shape: C, count: 3 } },
        { id: 'opt-1', value: 4, visualData: { shape: C, count: 4 } }, // Correct
        { id: 'opt-2', value: 2, visualData: { shape: C, count: 2 } },
        { id: 'opt-3', value: 6, visualData: { shape: C, count: 6 } },
      ];
      correctId = 'opt-1';
      explanation = lang === 'en'
        ? `Scale 1: ${A} = 2${B}. \nScale 2: ${B} = 2${C}. \nSubstitute: ${A} = 2 * (2${C}) = 4${C}.`
        : `1. Terazi: ${A} = 2${B}. \n2. Terazi: ${B} = 2${C}. \nYerine koyma: ${A} = 2 * (2${C}) = 4${C}.`;
    } else {
      data = {
        scales: [
          { left: [{shape: A, count: 1}, {shape: B, count: 1}], right: [{shape: C, count: 1}] }, 
          { left: [{shape: A, count: 1}], right: [{shape: B, count: 2}] } 
        ],
        question: { left: [{shape: C, count: 1}] } 
      };
      // Ans: 3B
      options = [
        { id: 'opt-0', value: 2, visualData: { shape: B, count: 2 } },
        { id: 'opt-1', value: 3, visualData: { shape: B, count: 3 } }, // Correct
        { id: 'opt-2', value: 4, visualData: { shape: B, count: 4 } },
        { id: 'opt-3', value: 5, visualData: { shape: B, count: 5 } },
      ];
      correctId = 'opt-1';
      explanation = lang === 'en'
        ? `Scale 2: ${A} = 2${B}. \nScale 1: (2${B}) + ${B} = ${C}. \nResult: 3${B} = ${C}.`
        : `İkinci teraziden: ${A} = 2${B}. \nBirinci terazide ${A}'yı yerine koy: (2${B}) + ${B} = ${C}. \nSonuç: 3${B} = ${C}.`;
    }

    return {
      id: `bal-${Date.now()}`,
      type: PuzzleType.BALANCE_SCALE,
      category: 'LOGIC',
      difficulty,
      data,
      question: lang === 'en' ? "What replaces the question mark?" : "Soru işareti yerine hangisi gelmelidir?",
      options,
      correctOptionId: correctId,
      explanation
    };
  }

  static generateCubeFolding(difficulty: Difficulty, lang: Language): Puzzle {
    const pool = difficulty === 'Hard' 
      ? ['●', '○', '◎', '⊙', '⊕', '⊗'] 
      : ['A', 'B', 'C', 'D', 'E', 'F']; 
      
    const symbols = shuffle(pool).slice(0, 6);
    const opposites = [[0, 5], [1, 3], [2, 4]];
    
    const validTriplets = [[0, 2, 3], [0, 1, 2], [0, 3, 4], [0, 1, 4], [5, 2, 3], [5, 1, 2]];
    const correctTriplet = validTriplets[randomInt(0, validTriplets.length - 1)];
    const invalidTriplets: number[][] = [];
    while(invalidTriplets.length < 3) {
      const pair = opposites[randomInt(0, 2)];
      const third = randomInt(0, 5);
      if (third !== pair[0] && third !== pair[1]) {
        invalidTriplets.push(shuffle([pair[0], pair[1], third]));
      }
    }

    const optionsList = shuffle([correctTriplet, ...invalidTriplets]);
    const correctOptionId = `cube-${optionsList.findIndex(x => x === correctTriplet)}`;
    
    const options: PuzzleOption[] = optionsList.map((trip, idx) => ({
      id: `cube-${idx}`,
      value: "cube",
      visualData: { faces: [symbols[trip[0]], symbols[trip[1]], symbols[trip[2]]] }
    }));

    return {
      id: `cube-${Date.now()}`,
      type: PuzzleType.CUBE_FOLDING,
      category: 'VISUAL',
      difficulty,
      data: { net: symbols },
      question: lang === 'en' ? "Which cube can be formed?" : "Açık hali verilen küpün kapalı hali hangisi olabilir?",
      options,
      correctOptionId,
      explanation: lang === 'en'
        ? `Opposite faces cannot be seen together. e.g. ${symbols[opposites[0][0]]} and ${symbols[opposites[0][1]]} are opposites.`
        : `Kural: Karşılıklı yüzler aynı anda görülemez. Örneğin ${symbols[opposites[0][0]]} ve ${symbols[opposites[0][1]]} zıt yüzlerdir.`
    };
  }

  static generateSymbolEquation(difficulty: Difficulty, lang: Language): Puzzle {
    const shapes = shuffle(['circle', 'square', 'triangle', 'star']);
    const A = shapes[0];
    const B = shapes[1];
    const C = shapes[2];

    let valA = randomInt(3, 15);
    let valB = randomInt(3, 15);
    let valC = randomInt(3, 15);

    const equations: SymbolEquationData['equations'] = [];
    let explanation = "";

    if (difficulty === 'Easy') {
      equations.push({ items: [A, '+', A], result: valA * 2 });
      equations.push({ items: [A, '+', B], result: valA + valB });
      equations.push({ items: [B, '+', C], result: valB + valC });
      explanation = lang === 'en'
        ? `Eq 1: 2*${A} = ${valA*2} -> ${A}=${valA}.\nEq 2: ${valA} + ${B} = ${valA+valB} -> ${B}=${valB}.\nEq 3: ${valB} + ${C} = ${valB+valC} -> ${C}=${valC}.`
        : `1. Denklem: 2 tane ${A} = ${valA*2} ise ${A}=${valA}.\n2. Denklem: ${valA} + ${B} = ${valA+valB} ise ${B}=${valB}.\n3. Denklem: ${valB} + ${C} = ${valB+valC} ise ${C}=${valC}.`;
    } else {
      equations.push({ items: [A, '+', B], result: valA + valB });
      equations.push({ items: [B, '-', C], result: valB - valC });
      equations.push({ items: [A, '+', C], result: valA + valC });
      explanation = lang === 'en'
        ? `System of Equations: Solve via substitution or elimination. ${A}=${valA}, ${B}=${valB}, ${C}=${valC}.`
        : `Sistem Denklemi: Taraf tarafa toplayarak veya yerine koyarak çözülür. ${A}=${valA}, ${B}=${valB}, ${C}=${valC}.`;
    }

    const correctVal = valA + valB + valC;
    const questionItems = [A, '+', B, '+', C];
    
    const optionsList = [correctVal];
    while(optionsList.length < 5) optionsList.push(correctVal + randomInt(1, 15) * (Math.random()>.5?1:-1));

    const shuffledOpts = shuffle(Array.from(new Set(optionsList))).slice(0,5);
    const correctOptionId = `sym-${shuffledOpts.indexOf(correctVal)}`;
    const options: PuzzleOption[] = shuffledOpts.map((val, idx) => ({
      id: `sym-${idx}`,
      value: val
    }));

    return {
      id: `sym-${Date.now()}`,
      type: PuzzleType.SYMBOL_EQUATION,
      category: 'NUMERICAL',
      difficulty,
      data: { equations, question: { items: questionItems, result: '?' } },
      question: lang === 'en' ? "What is the result?" : "İşlemlerin sonucuna göre soru işareti yerine kaç gelmelidir?",
      options,
      correctOptionId,
      explanation
    };
  }

  static generateOddOneOut(difficulty: Difficulty, lang: Language): Puzzle {
    const ruleType = randomInt(0, 1) === 0 ? 'count' : 'color';
    let options: PuzzleOption[] = [];
    let correctId = "";
    let explanation = "";

    if (ruleType === 'count') {
      const validCounts = difficulty === 'Hard' ? [3, 6, 9, 12, 15] : [2, 4, 6, 8, 10];
      const invalidCounts = difficulty === 'Hard' ? [4, 5, 7, 8] : [3, 5, 7];
      
      const shuffledValid = shuffle(validCounts).slice(0, 4);
      const target = invalidCounts[randomInt(0, invalidCounts.length - 1)];
      const allCounts = shuffle([...shuffledValid, target]);
      
      correctId = `odd-${allCounts.indexOf(target)}`;
      options = allCounts.map((count, idx) => ({
        id: `odd-${idx}`,
        value: "pattern",
        visualData: { type: 'dots', count: count, color: 'bg-brand-600' }
      }));
      explanation = lang === 'en'
        ? (difficulty === 'Hard' ? "Others are multiples of 3." : "Others are even numbers.")
        : (difficulty === 'Hard' ? "Diğer seçenekler 3'ün katıdır." : "Diğer seçenekler çift sayıdır.");
    } else {
       const optionsData = Array(5).fill(null).map((_, i) => ({ isTarget: i === 0 }));
       const shuffledOptions = shuffle(optionsData);
       correctId = `odd-${shuffledOptions.findIndex(o => o.isTarget)}`;
       
       options = shuffledOptions.map((opt, idx) => ({
        id: `odd-${idx}`,
        value: "pattern",
        visualData: { 
            type: 'grid', 
            colors: opt.isTarget 
                ? ['red', 'red', 'red', 'blue'] 
                : ['red', 'blue', 'blue', 'blue'] 
        }
       }));
       explanation = lang === 'en'
         ? "Count of Red vs Blue squares is different."
         : "Kırmızı ve Mavi karelerin sayısı diğerlerinden farklıdır.";
    }

    return {
      id: `odd-${Date.now()}`,
      type: PuzzleType.ODD_ONE_OUT,
      category: 'VISUAL',
      difficulty,
      data: { ruleType },
      question: lang === 'en' ? "Find the odd one out." : "Farklı olanı bulunuz.",
      options,
      correctOptionId: correctId,
      explanation
    };
  }

  static generateQuestion(config: { difficulty: Difficulty, lang: Language }): Puzzle {
    const types = [
      'TRIANGLE', 'MATRIX', 'BALANCE', 'CUBE', 'SYMBOL', 'ODD_ONE_OUT', 'WORD', 'GEO'
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    
    switch (type) {
      case 'TRIANGLE': return this.generateTriangleMath(config.difficulty, config.lang);
      case 'MATRIX': return this.generateMatrixLogic(config.difficulty, config.lang);
      case 'BALANCE': return this.generateBalanceScale(config.difficulty, config.lang);
      case 'CUBE': return this.generateCubeFolding(config.difficulty, config.lang);
      case 'SYMBOL': return this.generateSymbolEquation(config.difficulty, config.lang);
      case 'ODD_ONE_OUT': return this.generateOddOneOut(config.difficulty, config.lang);
      case 'WORD': return this.generateWordProblem(config.difficulty, config.lang);
      case 'GEO': return this.generateAnalyticGeo(config.difficulty, config.lang);
      default: return this.generateTriangleMath(config.difficulty, config.lang);
    }
  }
}
