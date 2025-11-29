// Logic Generators ported to pure JavaScript/ES6

// Helper to generate random integer
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to shuffle array
const shuffle = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// --- 1. Analytic Geometry Generator ---
export class AnalyticGeoGenerator {
  static generate(difficulty = 'Medium') {
    // Concept: Distance between two points or Midpoint logic
    // Easy: Midpoint (integer result). Hard: Distance (Pythagorean triples).
    
    let x1, y1, x2, y2;
    let questionText, correctAnswer, explanation;

    if (difficulty === 'Easy') {
        // Midpoint Logic
        x1 = randomInt(2, 20) * 2; // ensure even for integer division
        y1 = randomInt(2, 20) * 2;
        x2 = randomInt(2, 20) * 2;
        y2 = randomInt(2, 20) * 2;
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        questionText = `A(${x1}, ${y1}) ve B(${x2}, ${y2}) noktalarının orta noktası aşağıdakilerden hangisidir?`;
        correctAnswer = `(${midX}, ${midY})`;
        explanation = `Orta nokta formülü: ((x1+x2)/2, (y1+y2)/2). (${x1}+${x2})/2 = ${midX}, (${y1}+${y2})/2 = ${midY}.`;

    } else {
        // Distance Logic (Pythagorean Triples: 3-4-5, 6-8-10, 5-12-13)
        const triples = [[3,4,5], [6,8,10], [5,12,13], [8,15,17]];
        const t = triples[randomInt(0, triples.length - 1)];
        const dx = Math.random() > 0.5 ? t[0] : t[1];
        const dy = dx === t[0] ? t[1] : t[0];
        
        x1 = randomInt(5, 15);
        y1 = randomInt(5, 15);
        x2 = x1 + dx;
        y2 = y1 + dy;
        
        questionText = `A(${x1}, ${y1}) ve B(${x2}, ${y2}) noktaları arasındaki uzaklık kaç birimdir?`;
        correctAnswer = t[2];
        explanation = `Uzaklık formülü: √((x2-x1)² + (y2-y1)²). √(${dx}² + ${dy}²) = √(${dx*dx} + ${dy*dy}) = ${t[2]}.`;
    }

    const correctOptionId = `geo-correct`;
    
    // Generate distractors
    let options = [
        { id: correctOptionId, value: correctAnswer }
    ];
    
    // Add dummy options
    for(let i=0; i<4; i++) {
        if (difficulty === 'Easy') {
            options.push({ id: `geo-${i}`, value: `(${randomInt(2,20)}, ${randomInt(2,20)})` });
        } else {
            let fake = typeof correctAnswer === 'number' ? correctAnswer + randomInt(1,5) * (Math.random()>.5?1:-1) : 0;
            if(fake === correctAnswer) fake += 1;
            options.push({ id: `geo-${i}`, value: fake });
        }
    }
    
    return {
        type: 'ANALYTIC_GEO',
        category: 'NUMERICAL',
        difficulty,
        question: questionText,
        options: shuffle(options),
        correctOptionId,
        explanation
    };
  }
}

// --- 2. Word Problem Generator ---
export class WordProblemGenerator {
  static generate(difficulty = 'Medium') {
    // Concept: Age problems or Ratios
    // Example: "Ali is 2 times Veli's age..."
    
    const names = shuffle(['Ali', 'Ayşe', 'Mehmet', 'Zeynep', 'Can', 'Elif']);
    const n1 = names[0];
    const n2 = names[1];
    
    let veliAge = randomInt(5, 15);
    let diff = randomInt(4, 20);
    let aliAge = veliAge + diff; // Ali is older
    
    let questionText, correctAnswer, explanation;

    if (difficulty === 'Easy') {
        questionText = `${n1}, ${n2}'den ${diff} yaş büyüktür. ${n2} ${veliAge} yaşında olduğuna göre, ikisinin yaşları toplamı kaçtır?`;
        correctAnswer = aliAge + veliAge;
        explanation = `${n2}=${veliAge}, ${n1}=${veliAge}+${diff}=${aliAge}. Toplam = ${aliAge+veliAge}.`;
    } else {
        // "Total is X. Ali is 2 times Veli."
        let ratio = randomInt(2, 4);
        veliAge = randomInt(5, 15);
        aliAge = veliAge * ratio;
        const total = aliAge + veliAge;
        
        questionText = `${n1} ve ${n2}'nin yaşları toplamı ${total} tür. ${n1}'nin yaşı ${n2}'nin yaşının ${ratio} katı olduğuna göre, ${n1} kaç yaşındadır?`;
        correctAnswer = aliAge;
        explanation = `${n2} = x dersek, ${n1} = ${ratio}x. Toplam ${ratio+1}x = ${total}. x=${veliAge}. ${n1} = ${ratio}*${veliAge} = ${aliAge}.`;
    }

    const correctOptionId = `word-correct`;
    let options = [{ id: correctOptionId, value: correctAnswer }];
    
    // Distractors
    options.push({ id: 'd1', value: correctAnswer + randomInt(1,3) });
    options.push({ id: 'd2', value: correctAnswer - randomInt(1,3) });
    options.push({ id: 'd3', value: veliAge }); // Distractor: the other person's age
    options.push({ id: 'd4', value: correctAnswer + 10 });

    return {
        type: 'WORD_PROBLEM',
        category: 'LOGIC',
        difficulty,
        question: questionText,
        options: shuffle(options),
        correctOptionId,
        explanation
    };
  }
}

// --- 3. Shape Generator (Triangle Math) ---
export class ShapeGenerator {
  static generate(difficulty = 'Medium') {
     const tMin = 4, tMax = 15;
     const rules = [
        { desc: "(Top * Left) + Right = Center", calc: (t, l, r) => (t * l) + r },
        { desc: "|(Top - Right)| * Left = Center", calc: (t, l, r) => Math.abs(t - r) * l },
        { desc: "Top + Left + Right = Center", calc: (t, l, r) => t + l + r }
     ];

     const selectedRule = rules[randomInt(0, rules.length - 1)];

     let t = randomInt(tMin, tMax);
     let l = randomInt(tMin, tMax);
     let r = randomInt(tMin, tMax);
     let center = selectedRule.calc(t, l, r);
     
     const correctAnswer = center;
     const correctOptionId = `shape-correct`;
     
     let options = [{ id: correctOptionId, value: correctAnswer }];
     while(options.length < 5) {
         let val = correctAnswer + randomInt(-10, 10);
         if(val > 0 && !options.find(o => o.value === val)) {
             options.push({ id: `shape-${options.length}`, value: val });
         }
     }

     return {
         type: 'SHAPE_MATH', // Maps to TRIANGLE_MATH in frontend
         category: 'VISUAL',
         difficulty,
         data: { top: t, left: l, right: r, center: '?', ruleDescription: selectedRule.desc },
         question: "Soru işareti yerine hangi sayı gelmelidir?",
         options: shuffle(options),
         correctOptionId,
         explanation: `Kural: ${selectedRule.desc}.`
     };
  }
}
