// Learning Path Data Utility
// This file contains the actual module data from the learning path files

export const getLearningPathModules = () => {
  return {
    'Beginner': [
      {
        id: 'plant-basics',
        title: 'Plant Fundamentals - Understanding Your Green Friends',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        description: 'Master the essential knowledge about plant types, life cycles, and basic plant biology for successful gardening',
        lessons: [
          {
            id: 1,
            title: 'Plant Types & Life Cycles - The Foundation of Gardening',
            content: 'Understanding plant life cycles is crucial for planning your garden and knowing what to expect from each plant. Plants are categorized into three main types based on their life cycle:',
            points: [
              '🌱 ANNUALS: Complete their entire life cycle in one growing season. They grow, flower, produce seeds, and die all within a year. Examples: Marigolds, lettuce, petunias, zinnias. Perfect for beginners because you get quick results and can start fresh each year.',
              '🌿 PERENNIALS: Live for multiple years, often coming back stronger each season. They may die back in winter but regrow from their roots. Examples: Roses, hostas, lavender, mint, daylilies. Great investment plants that provide long-term garden structure.',
              '🌾 BIENNIALS: Take exactly two years to complete their cycle. First year: grow leaves and roots. Second year: flower, produce seeds, then die. Examples: Carrots, parsley, foxgloves, hollyhocks. Require patience but offer unique growing experiences.',
              '💡 PLANNING TIP: Mix all three types in your garden! Annuals for quick color, perennials for structure, and biennials for variety. This creates a dynamic, ever-changing garden that stays interesting year-round.',
              '🔬 PLANT ANATOMY: Understanding basic plant parts - roots (absorb water and nutrients), stems (transport water and nutrients), leaves (make food through photosynthesis), flowers (reproduction), and fruits/seeds (plant babies).',
              '🌱 GROWTH PATTERNS: Plants grow in two ways - primary growth (getting taller) and secondary growth (getting wider). Understanding this helps you know when and how to prune or support your plants.'
            ]
          },
          {
            id: 2,
            title: 'Choosing Your First Plants - The Success Formula',
            content: 'Selecting the right plants for your first garden is like choosing the right training wheels for learning to ride a bike. These plants are forgiving, rewarding, and will build your confidence:',
            points: [
              '🌿 HERBS - The Perfect Starting Point: Basil (loves warmth, grows fast, great for cooking), Mint (vigorous grower, hard to kill, spreads easily), Parsley (biennial, great for garnishes), Chives (perennial, comes back every year, mild onion flavor). Herbs are forgiving because they\'re meant to be harvested regularly.',
              '🥬 VEGETABLES - Quick Rewards: Lettuce (fast-growing, can harvest multiple times, cool-season crop), Spinach (nutrient-dense, grows in cool weather), Radishes (ready in 3-4 weeks, great for kids), Cherry tomatoes (more forgiving than large tomatoes, continuous harvest). Start with leafy greens - they\'re the easiest!',
              '🌸 FLOWERS - Instant Gratification: Marigolds (pest-repellent, bright colors, easy from seed), Calendula (edible flowers, self-seeding), Sunflowers (dramatic height, attracts birds, easy to grow). Flowers provide immediate visual rewards and attract beneficial insects.',
              '🏠 HOUSEPLANTS - Year-Round Gardening: Pothos (trailing vine, tolerates neglect, purifies air), Snake Plant (nearly indestructible, low water needs), Spider Plant (produces baby plants, great for sharing). Perfect for learning plant care basics indoors.',
              '💡 SUCCESS TIP: Start with just 3-5 plants maximum. Master their care routine before adding more. It\'s better to have a few thriving plants than many struggling ones!',
              '🎯 PLANT SELECTION CRITERIA: Choose plants that match your available light, space, and time commitment. Consider your local climate and growing season length.'
            ]
          },
          {
            id: 3,
            title: 'Plant Care Basics - The Essential Skills',
            content: 'The key to gardening success is building confidence through small wins. Think of it like learning to cook - you don\'t start with a five-course meal! Here\'s your step-by-step approach:',
            points: [
              '🎯 THE 3-5 PLANT RULE: Begin with maximum 3-5 plants. This allows you to give each plant individual attention and learn their specific needs. More plants = more complexity = higher chance of failure. Quality over quantity!',
              '📅 DAILY CARE ROUTINE: Establish a simple routine: Check plants daily (2-3 minutes), water when needed, observe growth changes. Consistency is more important than perfection. Plants thrive on routine, just like pets.',
              '💧 MASTER THE BASICS FIRST: Focus on watering and light requirements before anything else. These are the two most critical factors for plant survival. Get these right, and 80% of your problems disappear.',
              '📈 GRADUAL SCALING: Once you\'ve kept 3-5 plants alive for 2-3 months, add 2-3 more. This gradual approach builds confidence and prevents overwhelm. Each success makes you more confident for the next challenge.',
              '🔍 OBSERVATION SKILLS: Learn to "read" your plants. Yellow leaves, drooping, new growth - these are your plants\' way of communicating. The more you observe, the better gardener you become.',
              '💡 CONFIDENCE BUILDING: Celebrate small wins! First new leaf, first flower, first harvest. These moments build the confidence you need to tackle more challenging plants later.'
            ]
          }
        ],
        quiz: {
          title: 'Plant Fundamentals Quiz',
          questions: [
            {
              id: 1,
              question: '🔍 PLANT IDENTIFICATION: Look at this plant. It has bright, colorful flowers and appears to be growing vigorously in a single season. What type of plant is this?',
              image: '/uploads/learning_paths/image/learning_1761296409_63f4b9f9.jpg',
              imageDescription: 'A vibrant annual plant with bright flowers showing typical single-season growth characteristics',
              options: ['Annual (lives one season)', 'Perennial (lives many years)', 'Biennial (lives two years)', 'Houseplant'],
              correct: 0,
              explanation: '✅ CORRECT! This is an annual plant. Key identifying features: Bright, showy flowers typical of annuals, single-season growth pattern, and the vibrant appearance that annuals are known for. Annuals put all their energy into one spectacular growing season!'
            },
            {
              id: 2,
              question: '🌱 BEGINNER PLANT SELECTION: This plant is known for being nearly indestructible and perfect for beginners. What is it?',
              image: '/uploads/learning_paths/image/learning_1761296412_1fd407a0.jpg',
              imageDescription: 'A snake plant (Sansevieria) showing its characteristic upright, sword-like leaves and low-maintenance appearance',
              options: ['Orchid (needs special care)', 'Snake Plant (very forgiving)', 'Fiddle Leaf Fig (finicky)', 'Succulent (needs lots of sun)'],
              correct: 1,
              explanation: '✅ CORRECT! This is a Snake Plant (Sansevieria). Perfect for beginners because: It tolerates low light, needs minimal watering, is nearly impossible to kill, and purifies indoor air. It\'s often called "indestructible" for good reason!'
            },
            {
              id: 3,
              question: '📊 GARDEN PLANNING: How many plants should a beginner start with for the best success rate?',
              image: '/uploads/learning_paths/image/learning_1761302201_2dfe938a.jpg',
              imageDescription: 'A beginner garden setup showing the ideal number of plants for starting out',
              options: ['10-15 plants', '3-5 plants', '20+ plants', 'Just one plant'],
              correct: 1,
              explanation: '✅ CORRECT! 3-5 plants is the ideal starting number. This allows you to: Give each plant individual attention, learn their specific needs, build confidence through manageable care, and avoid overwhelm. Quality over quantity when learning!'
            }
          ]
        }
      },
      {
        id: 'soil-fundamentals',
        title: 'Soil Fundamentals - The Foundation of Plant Health',
        difficulty: 'Beginner',
        estimatedTime: '35 min',
        description: 'Master the basics of soil types, composition, and how to create the perfect growing environment for your plants',
        lessons: [
          {
            id: 4,
            title: 'Understanding Soil Types - Your Plant\'s Home',
            content: 'Soil is more than just dirt - it\'s your plant\'s home, providing nutrients, water, air, and support. Understanding soil types is crucial for plant success:',
            points: [
              '🏠 POTTING MIX vs GARDEN SOIL: Potting mix is specially formulated for containers - lightweight, well-draining, and sterile. Garden soil is too heavy and dense for pots, leading to poor drainage and root rot. Always use potting mix for container plants.',
              '💧 DRAINAGE IS CRITICAL: Good soil should drain water quickly while retaining some moisture. Look for mixes with perlite, vermiculite, or sand. Poor drainage = waterlogged roots = plant death. Your plant\'s roots need air as much as water!',
              '🌱 NUTRIENT CONTENT: Quality potting mixes contain slow-release fertilizers that feed plants for 3-6 months. Look for mixes labeled "with fertilizer" or "enriched." For edible plants, choose organic options to avoid chemical fertilizers.',
              '🔬 SOIL COMPONENTS: Peat moss (retains moisture), Perlite (improves drainage), Vermiculite (holds water and nutrients), Compost (adds nutrients and beneficial microbes). The best mixes contain a balance of these components.',
              '📊 pH LEVELS: Most plants prefer slightly acidic soil (pH 6.0-7.0). Some plants like blueberries need very acidic soil (pH 4.5-5.5). Test your soil pH if plants show nutrient deficiency symptoms.',
              '💡 SOIL SELECTION TIP: When in doubt, choose a premium potting mix. It costs more upfront but saves money in the long run by preventing plant problems and ensuring healthy growth.'
            ]
          },
          {
            id: 5,
            title: 'Soil Preparation & Container Selection',
            content: 'The right container and proper soil preparation make all the difference in plant health and growth:',
            points: [
              '🪴 CONTAINER ESSENTIALS: Ensure drainage holes in all containers - this is non-negotiable! Add saucers indoors to catch excess water. Choose appropriate size for plant growth - too small restricts roots, too large holds too much water.',
              '📏 SIZE MATTERS: Start with containers 2-4 inches larger than the plant\'s root ball. Most plants need to be repotted every 1-2 years as they grow. Watch for roots coming out of drainage holes - that\'s your signal to repot.',
              '🏺 MATERIAL CHOICES: Clay pots (breathable, good drainage, but heavy), Plastic pots (lightweight, retain moisture, affordable), Ceramic pots (attractive, good drainage, but fragile). Choose based on your plant\'s needs and your preferences.',
              '🌱 SOIL PREPARATION: Moisten potting mix before planting - dry soil repels water. Fill container 1/3 full, place plant, fill around roots, firm gently. Leave 1 inch space at top for watering. Water thoroughly after planting.',
              '🔄 REPOTTING BASICS: Gently remove plant from old pot, loosen root ball slightly, place in new pot with fresh soil. Water well and place in appropriate light. Don\'t fertilize for 2-3 weeks after repotting.',
              '💧 WATERING SETUP: Use saucers to catch excess water, but empty them after 30 minutes to prevent root rot. Group plants with similar water needs together for easier care.'
            ]
          },
          {
            id: 6,
            title: 'Soil Amendments & Plant Nutrition',
            content: 'Learn how to improve your soil and provide proper nutrition for healthy plant growth:',
            points: [
              '🌿 ORGANIC AMENDMENTS: Compost (adds nutrients and improves structure), Worm castings (rich in nutrients, great for seedlings), Leaf mold (improves water retention), Manure (high in nitrogen, must be well-aged). These feed both plants and beneficial soil organisms.',
              '⚡ INORGANIC AMENDMENTS: Perlite (improves drainage and aeration), Vermiculite (holds water and nutrients), Sand (improves drainage in clay soils), Lime (raises pH for alkaline-loving plants). These improve soil structure and drainage.',
              '🍃 FERTILIZER BASICS: Plants need three main nutrients - Nitrogen (N) for green growth, Phosphorus (P) for roots and flowers, Potassium (K) for overall health. Look for balanced fertilizers like 10-10-10 for general use.',
              '⏰ FERTILIZING SCHEDULE: Most houseplants need fertilizing every 2-4 weeks during growing season (spring/summer). Reduce or stop in fall/winter when plants grow slower. Always follow package directions - more is not better!',
              '🌱 ORGANIC VS SYNTHETIC: Organic fertilizers (compost, fish emulsion) feed soil life and release nutrients slowly. Synthetic fertilizers (Miracle-Gro) provide quick nutrients but don\'t improve soil structure. Both have their place in gardening.',
              '💡 NUTRIENT DEFICIENCY SIGNS: Yellow leaves (nitrogen deficiency), Purple leaves (phosphorus deficiency), Brown leaf edges (potassium deficiency). Learn to read these signs to provide targeted nutrition.'
            ]
          }
        ],
        quiz: {
          title: 'Soil Fundamentals Quiz',
          questions: [
            {
              id: 4,
              question: '🔍 SOIL IDENTIFICATION: This soil sample is dark brown, feels crumbly, and holds water well but drains properly. What type of soil is this?',
              image: '/images/quiz/quiz-loamy-soil.jpg',
              imageDescription: 'Dark brown, crumbly soil sample showing good structure and balanced texture',
              options: ['Clay soil (heavy and dense)', 'Sandy soil (gritty and loose)', 'Loamy soil (balanced and crumbly)', 'Peaty soil (spongy and acidic)'],
              correct: 2,
              explanation: '✅ CORRECT! This is loamy soil - the "goldilocks" of soils! It has the perfect balance of sand, silt, and clay, providing good drainage while retaining moisture. Most garden plants love loamy soil because it offers the best of all worlds.'
            },
            {
              id: 5,
              question: '🪴 CONTAINER SELECTION: What is the most important feature a plant container must have?',
              options: ['Attractive color', 'Drainage holes', 'Large size', 'Expensive material'],
              correct: 1,
              explanation: '✅ CORRECT! Drainage holes are absolutely essential! Without them, water accumulates at the bottom, causing root rot and plant death. Even the most beautiful container is useless without proper drainage.'
            },
            {
              id: 6,
              question: '🌱 FERTILIZER KNOWLEDGE: What do the numbers 10-10-10 on a fertilizer package represent?',
              options: ['Price in dollars', 'NPK ratio (Nitrogen-Phosphorus-Potassium)', 'Weight in pounds', 'Expiration date'],
              correct: 1,
              explanation: '✅ CORRECT! The numbers 10-10-10 represent the NPK ratio - 10% Nitrogen, 10% Phosphorus, 10% Potassium. This is a balanced fertilizer suitable for most plants during their growing season.'
            }
          ]
        }
      },
      {
        id: 'plant-soil-relationships',
        title: 'Plant-Soil Relationships - Perfect Matches',
        difficulty: 'Beginner',
        estimatedTime: '40 min',
        description: 'Learn how different plants thrive in different soil conditions and how to match plants with their ideal soil environment',
        lessons: [
          {
            id: 7,
            title: 'Understanding Plant-Soil Compatibility',
            content: 'Different plants have evolved to thrive in different soil conditions. Understanding these relationships is key to gardening success:',
            points: [
              '🌱 CLAY SOIL PLANTS: Hostas (large leaves love moisture), Daylilies (tough roots handle heavy soil), Astilbe (feathery flowers need constant moisture), Japanese Iris (loves wet feet). These plants have adapted to slow-draining conditions.',
              '🌱 SANDY SOIL PLANTS: Lavender (silver leaves reflect sun, deep roots find water), Rosemary (Mediterranean native, drought-adapted), Succulents (store water in leaves), Cacti (spines reduce water loss). These plants evolved for quick drainage.',
              '🌱 LOAMY SOIL PLANTS: Tomatoes (need steady moisture and nutrients), Roses (require good drainage but consistent water), Lettuce (quick-growing, needs balanced conditions), Carrots (need loose soil for straight roots). Most garden favorites prefer this balance.',
              '🌱 PEATY SOIL PLANTS: Azaleas (shallow roots need acidic conditions), Blueberries (require pH 4.5-5.5 for iron absorption), Rhododendrons (large leaves need acidic soil), Camellias (evergreen beauty in acidic conditions). These plants evolved in forest floors.',
              '🔍 SOIL IDENTIFICATION: Clay soil (dark, sticky, forms clumps), Sandy soil (light, gritty, drains quickly), Loamy soil (dark, crumbly, balanced), Peaty soil (very dark, spongy, acidic). Learn to identify by sight and touch.',
              '💡 MATCHING STRATEGY: Choose plants that naturally thrive in your soil type, or modify your soil to suit your desired plants. It\'s easier to work with nature than against it!'
            ]
          },
          {
            id: 8,
            title: 'Soil Testing & Improvement Techniques',
            content: 'Learn simple techniques to test your soil and improve it for better plant health:',
            points: [
              '🧪 SIMPLE SOIL TESTS: The squeeze test (clay forms ball, sandy crumbles, loamy breaks when poked), The drainage test (dig hole, fill with water, time how long it takes to drain), The jar test (soil in water, see how particles settle). These help identify your soil type.',
              '📊 pH TESTING: Use test strips or send samples to extension services. Most plants prefer pH 6.0-7.0. Acidic soil (below 6.0) is good for blueberries and azaleas. Alkaline soil (above 7.0) is good for lavender and clematis.',
              '🌿 SOIL IMPROVEMENT: Add compost to all soils (improves structure and nutrients), Add sand to clay (improves drainage), Add organic matter to sand (improves water retention), Add lime to acidic soil (raises pH), Add sulfur to alkaline soil (lowers pH).',
              '⏰ TIMING MATTERS: Test soil in spring before planting. Add amendments 2-4 weeks before planting to allow them to integrate. Don\'t over-amend - start with small amounts and test results.',
              '🔄 LONG-TERM IMPROVEMENT: Regular addition of compost improves any soil over time. Cover crops add organic matter and nutrients. Mulching protects soil and adds organic matter as it decomposes.',
              '💧 WATERING ADJUSTMENTS: Clay soil needs less frequent, deeper watering. Sandy soil needs more frequent, lighter watering. Loamy soil needs moderate, regular watering. Adjust your watering schedule to your soil type.'
            ]
          },
          {
            id: 9,
            title: 'Creating the Perfect Growing Environment',
            content: 'Combine your knowledge of plants and soil to create optimal growing conditions:',
            points: [
              '🎯 PLANT SELECTION STRATEGY: Start with plants that naturally thrive in your soil type. This reduces maintenance and increases success. Research plant preferences before buying - it saves time and money.',
              '🌱 CONTAINER GARDENING: Use different soil mixes for different plants in containers. Cacti need sandy mix, ferns need moisture-retentive mix, herbs need well-drained mix. This gives you control over growing conditions.',
              '🏠 INDOOR ADAPTATIONS: Most houseplants prefer well-draining potting mix. Add extra perlite for succulents, extra peat for moisture-loving plants. Use saucers to catch water but empty them regularly.',
              '🌿 GARDEN BED PREPARATION: Test soil before planting new beds. Add amendments based on test results and plant needs. Create raised beds for better drainage if needed. Plan plant placement based on soil conditions.',
              '💡 SUCCESS TIPS: Group plants with similar soil needs together. This makes watering and fertilizing easier. Keep records of what works in your soil - this knowledge is valuable for future plantings.',
              '🔄 CONTINUOUS LEARNING: Observe how plants respond to your soil conditions. Some plants may surprise you by thriving in unexpected conditions. Gardening is about learning and adapting to your unique environment.'
            ]
          }
        ],
        quiz: {
          title: 'Plant-Soil Relationships Quiz',
          questions: [
            {
              id: 7,
              question: '🔍 SOIL IDENTIFICATION: This soil sample is light brown, feels gritty, and water drains through it quickly. Which plant would thrive best in this soil type?',
              image: '/images/quiz/quiz-sandy-soil.jpg',
              imageDescription: 'Light brown/tan soil sample with visible individual grains, appearing loose and gritty',
              options: ['Hostas (need constant moisture)', 'Lavender (drought-tolerant)', 'Azaleas (need acidic soil)', 'Astilbe (love wet conditions)'],
              correct: 1,
              explanation: '✅ CORRECT! Lavender is the perfect match for sandy soil. Sandy soil characteristics: Light brown color, gritty texture, drains water quickly (within minutes). Lavender evolved in Mediterranean climates with well-drained, dry conditions. Its silver leaves reflect sunlight and deep roots find water deep underground.'
            },
            {
              id: 8,
              question: '🧪 SOIL TEST INTERPRETATION: You did the squeeze test on this soil - it formed a ball but broke apart when you poked it. What type of soil is this?',
              image: '/images/quiz/quiz-loamy-squeeze-test.jpg',
              imageDescription: 'Soil sample showing the squeeze test result - forms ball but breaks when poked',
              options: ['Clay soil (stays in ball)', 'Sandy soil (crumbles apart)', 'Loamy soil (ball breaks when poked)', 'Peaty soil (spongy)'],
              correct: 2,
              explanation: '✅ CORRECT! This is loamy soil - the "goldilocks" of soils! The squeeze test result (forms ball but breaks when poked) is the key identifier. Loamy soil has: Perfect balance of sand, silt, and clay, good drainage but holds moisture, crumbly texture, ideal for most garden plants.'
            },
            {
              id: 9,
              question: '🌱 PLANT-SOIL MATCHING: This plant has yellow leaves and appears stressed. The soil around it is heavy and waterlogged. What soil improvement would help most?',
              image: '/images/quiz/quiz-plant-yellow-leaves.jpg',
              imageDescription: 'Plant with yellowing leaves sitting in heavy, waterlogged soil that appears dark and dense',
              options: ['Add more clay soil', 'Add more sand only', 'Loamy soil with compost', 'Keep the same soil'],
              correct: 2,
              explanation: '✅ CORRECT! Loamy soil with compost is the best solution. Yellow leaves + waterlogged soil = poor drainage and nutrient deficiency. Loamy soil provides: Good drainage (prevents waterlogging), balanced texture (not too heavy, not too light), and compost adds nutrients and improves structure.'
            }
          ]
        }
      }
    ],
    'Intermediate': [
      {
        id: 'advanced-plant-nutrition',
        title: 'Advanced Plant Nutrition - The Science of Feeding',
        difficulty: 'Intermediate',
        estimatedTime: '45 min',
        description: 'Master the science of plant nutrition, nutrient cycling, and advanced fertilizing strategies for optimal plant health and productivity',
        lessons: [
          {
            id: 10,
            title: 'Understanding Plant Nutrients - The Building Blocks of Growth',
            content: 'Plants are like athletes - they need the right nutrients in the right amounts to perform at their best. Understanding plant nutrition is key to growing healthy, productive plants:',
            points: [
              '🌿 NITROGEN (N) - The Growth Engine: Essential for leaf and stem growth, makes leaves green and lush. Deficiency signs: Yellow leaves, stunted growth. Excess signs: Dark green leaves, weak stems. Best for: Leafy vegetables, lawns, foliage plants.',
              '🌸 PHOSPHORUS (P) - The Root & Flower Power: Critical for root development, flowering, and fruiting. Deficiency signs: Purple leaves, poor flowering, weak roots. Excess signs: Can block other nutrients. Best for: Flowering plants, root vegetables, young plants.',
              '💪 POTASSIUM (K) - The Disease Fighter: Strengthens plants against diseases, improves fruit quality, helps with water regulation. Deficiency signs: Brown leaf edges, weak stems, poor fruit quality. Best for: Fruit trees, tomatoes, peppers.',
              '🔬 SECONDARY NUTRIENTS: Calcium (strong cell walls), Magnesium (chlorophyll production), Sulfur (protein synthesis). These are needed in smaller amounts but are still essential for plant health.',
              '⚡ MICRONUTRIENTS: Iron, zinc, copper, manganese, boron, molybdenum. Needed in tiny amounts but crucial for specific plant functions. Deficiency can cause specific symptoms like yellowing between leaf veins.',
              '📊 NUTRIENT BALANCE: The key is balance - too much of one nutrient can block others. Use balanced fertilizers (like 10-10-10) unless you have specific needs. Test your soil to know what your plants actually need.'
            ]
          },
          {
            id: 11,
            title: 'Advanced Fertilizing Strategies - Precision Nutrition',
            content: 'Different plants need different types of nutrition, and different situations call for different approaches. Here\'s your guide to advanced plant food options:',
            points: [
              '💧 LIQUID FERTILIZERS: Fast-acting, easy to apply, great for container plants and quick fixes. Examples: Fish emulsion, seaweed extract, water-soluble powders. Best for: Houseplants, seedlings, plants needing quick nutrition boost.',
              '🌱 GRANULAR FERTILIZERS: Slow-release, long-lasting, great for garden beds and established plants. Examples: Pelleted fertilizers, time-release capsules. Best for: Garden beds, trees, shrubs, long-term feeding.',
              '🌿 ORGANIC OPTIONS: Natural, improve soil structure, feed beneficial microbes. Examples: Compost, manure, bone meal, blood meal. Best for: Long-term soil health, organic gardening, improving soil structure.',
              '⚡ SYNTHETIC FERTILIZERS: Precise, fast-acting, easy to measure. Examples: Miracle-Gro, chemical NPK fertilizers. Best for: Quick results, precise nutrient control, commercial growing.',
              '🔄 COMPOST: The ultimate soil amendment - improves structure, adds nutrients, feeds beneficial microbes. Make your own or buy quality compost. Best for: All plants, soil improvement, sustainable gardening.',
              '📊 FERTILIZER RATIOS: N-P-K numbers tell you the ratio of nutrients. 10-10-10 is balanced, 20-10-10 is high nitrogen (good for leafy growth), 10-20-10 is high phosphorus (good for flowering).'
            ]
          },
          {
            id: 12,
            title: 'Nutrient Cycling & Soil Health - The Big Picture',
            content: 'Fertilizing at the right time and in the right way makes all the difference. Here\'s how to feed your plants effectively while building long-term soil health:',
            points: [
              '⏰ SEASONAL TIMING: Spring (when plants start growing), Summer (during active growth), Fall (for root development), Winter (minimal for most plants). Most plants need more nutrition during active growth periods.',
              '🌱 PLANT LIFE STAGE: Seedlings (light, frequent feeding), Young plants (regular feeding), Mature plants (maintenance feeding), Flowering plants (higher phosphorus before blooming). Adjust nutrition to plant needs.',
              '🌿 SOIL CONDITIONS: Test soil before fertilizing, water before applying fertilizer, avoid fertilizing stressed plants, don\'t fertilize in extreme heat or cold. Healthy soil makes fertilizer more effective.',
              '💧 APPLICATION METHODS: Top-dressing (spreading on soil surface), Side-dressing (placing near plant roots), Foliar feeding (spraying on leaves), Deep feeding (placing fertilizer in root zone). Choose method based on plant and fertilizer type.',
              '📏 DOSAGE CONTROL: More is not better - follow package directions, start with less and increase if needed, watch for signs of over-fertilization (burned leaves, stunted growth). It\'s easier to add more than to fix over-fertilization.',
              '🔄 FEEDING SCHEDULE: Create a regular schedule, adjust based on plant response, keep records of what works, be consistent but flexible. Regular, appropriate feeding is better than occasional heavy feeding.'
            ]
          }
        ],
        quiz: {
          title: 'Advanced Plant Nutrition Quiz',
          questions: [
            {
              id: 10,
              question: '🧪 NUTRIENT DEFICIENCY: This plant shows yellowing between leaf veins while the veins remain green. What nutrient is deficient?',
              image: '/images/quiz/quiz-iron-deficiency.jpg',
              imageDescription: 'Plant leaves showing interveinal chlorosis - yellowing between green veins, typical of iron deficiency',
              options: ['Nitrogen deficiency', 'Iron deficiency', 'Phosphorus deficiency', 'Potassium deficiency'],
              correct: 1,
              explanation: '✅ CORRECT! This is iron deficiency, shown by interveinal chlorosis (yellowing between green veins). Iron is a micronutrient essential for chlorophyll production. This is common in alkaline soils where iron becomes unavailable to plants.'
            },
            {
              id: 11,
              question: '📊 FERTILIZER ANALYSIS: A fertilizer labeled 15-30-15 would be best for which type of plants?',
              options: ['Leafy vegetables (high nitrogen)', 'Flowering plants (high phosphorus)', 'Fruit trees (high potassium)', 'General garden plants (balanced)'],
              correct: 1,
              explanation: '✅ CORRECT! 15-30-15 fertilizer is high in phosphorus (30), which is essential for flowering and fruiting. The high phosphorus content makes it ideal for flowering plants, vegetables that produce fruits, and plants in their blooming phase.'
            },
            {
              id: 12,
              question: '🌱 FERTILIZER TIMING: When is the best time to apply a slow-release fertilizer to established perennials?',
              options: ['Mid-winter', 'Early spring before growth starts', 'Mid-summer during peak growth', 'Late fall after dormancy'],
              correct: 1,
              explanation: '✅ CORRECT! Early spring is the ideal time to apply slow-release fertilizer to perennials. This timing allows the fertilizer to be available just as plants begin their active growth period, providing sustained nutrition throughout the growing season.'
            }
          ]
        }
      },
      {
        id: 'soil-chemistry-plant-health',
        title: 'Soil Chemistry & Plant Health - The Science Connection',
        difficulty: 'Intermediate',
        estimatedTime: '50 min',
        description: 'Deep dive into soil chemistry, nutrient availability, and how soil conditions directly affect plant health and productivity',
        lessons: [
          {
            id: 13,
            title: 'Soil Chemistry - The Hidden World Beneath',
            content: 'Soil is a complex ecosystem with chemical processes that directly affect plant health. Understanding soil chemistry helps you create the perfect growing environment:',
            points: [
              '🧪 pH AND NUTRIENT AVAILABILITY: Most nutrients are available at pH 6.0-7.0. Acidic soil (below 6.0) makes some nutrients unavailable, alkaline soil (above 7.0) makes others unavailable. Adjust pH to optimize nutrient uptake.',
              '⚡ CATION EXCHANGE CAPACITY (CEC): Measures soil\'s ability to hold nutrients. High CEC (clay soils) holds nutrients well but may need more fertilizer. Low CEC (sandy soils) needs frequent, light applications. Test your soil\'s CEC.',
              '🌱 ORGANIC MATTER: Improves soil structure, increases water retention, feeds beneficial microbes, slowly releases nutrients. Aim for 3-5% organic matter in garden soil. Add compost, manure, or other organic materials regularly.',
              '💧 SOIL MOISTURE AND NUTRIENTS: Water carries nutrients to plant roots. Too much water leaches nutrients away. Too little water prevents nutrient uptake. Maintain consistent moisture for optimal nutrition.',
              '🦠 MICROBIAL ACTIVITY: Beneficial bacteria and fungi break down organic matter, make nutrients available to plants, improve soil structure. Healthy soil has active microbial life. Avoid overuse of chemicals that kill beneficial microbes.',
              '🔄 NUTRIENT CYCLING: Plants take up nutrients, return them to soil when they decompose. Some plants (legumes) add nitrogen to soil. Understanding this cycle helps you maintain soil fertility naturally.'
            ]
          },
          {
            id: 14,
            title: 'Root Systems & Nutrient Uptake - The Hidden Network',
            content: 'Root systems are the hidden foundation of plant health. Understanding how roots work helps you provide the best growing conditions:',
            points: [
              '🌱 ROOT TYPES: Taproots (deep, single main root), Fibrous roots (shallow, many small roots), Adventitious roots (grow from stems or leaves). Different plants have different root systems for different purposes.',
              '💧 WATER AND NUTRIENT UPTAKE: Roots absorb water and nutrients through root hairs. Most absorption happens in the top 6-12 inches of soil. Keep this zone healthy and well-fed for optimal plant growth.',
              '🌿 ROOT DEPTH: Shallow roots (lettuce, herbs) vs. deep roots (tomatoes, trees). Plant according to your soil depth and structure. Deep-rooted plants can access water and nutrients from deeper soil layers.',
              '🔄 ROOT GROWTH PATTERNS: Roots grow toward water and nutrients. They avoid compacted soil and toxic areas. Understanding this helps you place plants and amendments effectively.',
              '🦠 ROOT-MICROBE RELATIONSHIPS: Mycorrhizal fungi form partnerships with plant roots, extending the root system, improving nutrient uptake. Some plants depend on these relationships for optimal growth.',
              '💡 ROOT HEALTH INDICATORS: Healthy roots are white or light-colored, firm, and well-branched. Unhealthy roots are dark, mushy, or stunted. Check root health when repotting or transplanting.'
            ]
          },
          {
            id: 15,
            title: 'Advanced Soil Improvement Strategies - Building Better Soil',
            content: 'Good soil is the foundation of a successful garden. Here are proven strategies for improving your soil over time:',
            points: [
              '🌱 ORGANIC MATTER ADDITION: Add compost, manure, leaf mold, or other organic materials regularly. This improves soil structure, increases water retention, and feeds beneficial microbes. Aim for 1-2 inches per year.',
              '🔄 COVER CROPS: Plant cover crops in fallow areas to add organic matter, prevent erosion, fix nitrogen (legumes), break up compacted soil. Examples: clover, rye, buckwheat. Turn under before planting main crops.',
              '🌿 MULCHING: Apply organic mulch (straw, leaves, wood chips) to retain moisture, suppress weeds, add organic matter as it decomposes. Mulch also moderates soil temperature and prevents erosion.',
              '💧 PROPER WATERING: Water deeply and infrequently to encourage deep root growth. Avoid frequent shallow watering that keeps roots near the surface. Use drip irrigation or soaker hoses for efficient watering.',
              '🔄 CROP ROTATION: Rotate crops to prevent nutrient depletion, break pest cycles, improve soil structure. Different plants have different nutrient needs and root structures. Plan a 3-4 year rotation cycle.',
              '📊 REGULAR TESTING: Test soil every 2-3 years to monitor pH, nutrient levels, and organic matter content. This helps you make informed decisions about amendments and fertilizers.'
            ]
          }
        ],
        quiz: {
          title: 'Soil Chemistry & Plant Health Quiz',
          questions: [
            {
              id: 13,
              question: '🧪 SOIL CHEMISTRY: This soil test shows a pH of 8.2. What problem might plants experience?',
              image: '/images/quiz/quiz-alkaline-soil-test.jpg',
              imageDescription: 'Soil pH test result showing pH 8.2, indicating alkaline soil conditions',
              options: ['Iron deficiency (nutrients locked up)', 'Too much nitrogen', 'Perfect growing conditions', 'Too much organic matter'],
              correct: 0,
              explanation: '✅ CORRECT! Alkaline soil (pH 8.2) causes iron and other micronutrients to become unavailable to plants, leading to deficiency symptoms like yellowing leaves. This is common in areas with limestone bedrock or over-liming.'
            },
            {
              id: 14,
              question: '🌱 ROOT SYSTEM ANALYSIS: This plant has a deep taproot system. What advantage does this provide?',
              image: '/images/quiz/quiz-taproot-system.jpg',
              imageDescription: 'Plant with deep taproot system showing extensive vertical root growth',
              options: ['Better water access from deep soil', 'More surface area for nutrient uptake', 'Easier transplanting', 'Faster growth'],
              correct: 0,
              explanation: '✅ CORRECT! Deep taproot systems allow plants to access water and nutrients from deeper soil layers, making them more drought-tolerant and able to survive in challenging conditions where surface water is limited.'
            },
            {
              id: 15,
              question: '🔄 SOIL IMPROVEMENT: What is the primary benefit of adding organic matter to soil?',
              options: ['Increases soil pH', 'Improves soil structure and nutrient availability', 'Makes soil more alkaline', 'Reduces water retention'],
              correct: 1,
              explanation: '✅ CORRECT! Organic matter improves soil structure by creating pore spaces, increases nutrient availability by feeding beneficial microbes, and improves water retention. It\'s the foundation of healthy soil.'
            }
          ]
        }
      },
      {
        id: 'plant-disease-soil-management',
        title: 'Plant Disease & Soil Management - Prevention & Treatment',
        difficulty: 'Intermediate',
        estimatedTime: '55 min',
        description: 'Learn to identify, prevent, and treat plant diseases through proper soil management and cultural practices',
        lessons: [
          {
            id: 16,
            title: 'Understanding Plant Diseases - The Soil Connection',
            content: 'Many plant diseases start in the soil or are influenced by soil conditions. Understanding this connection is key to prevention:',
            points: [
              '🦠 SOIL-BORNE PATHOGENS: Many plant diseases live in soil and infect plants through roots. Examples: Fusarium wilt, Verticillium wilt, root rot fungi. These pathogens can survive in soil for years, making prevention crucial.',
              '💧 WATER AND DISEASE: Overwatering creates conditions favorable for root rot and fungal diseases. Poor drainage leads to waterlogged soil where harmful bacteria and fungi thrive. Proper watering and drainage are your first defense.',
              '🌱 SOIL pH AND DISEASE: Some diseases are more common in certain pH ranges. Clubroot (brassicas) thrives in acidic soil, while some fungal diseases prefer alkaline conditions. Adjusting pH can help prevent specific diseases.',
              '🔄 CROP ROTATION: Rotating crops prevents disease buildup in soil. Different plant families are susceptible to different diseases. A 3-4 year rotation cycle breaks disease cycles and maintains soil health.',
              '🌿 PLANT RESISTANCE: Some plant varieties are naturally resistant to certain diseases. Choose resistant varieties when available. Healthy plants grown in good soil are naturally more resistant to diseases.',
              '🧪 SOIL TESTING: Regular soil testing helps identify nutrient imbalances that can make plants more susceptible to diseases. Proper nutrition strengthens plant immune systems.'
            ]
          },
          {
            id: 17,
            title: 'Preventive Soil Management - Building Plant Immunity',
            content: 'The best defense against plant diseases is prevention through proper soil management and cultural practices:',
            points: [
              '🌱 SOIL STRUCTURE: Well-structured soil with good drainage prevents waterlogging that leads to root diseases. Add organic matter to improve soil structure and drainage. Avoid working soil when it\'s too wet.',
              '💧 WATER MANAGEMENT: Water plants at the base, not on leaves, to prevent foliar diseases. Use drip irrigation or soaker hoses. Water in the morning so leaves dry quickly. Avoid overhead watering that spreads diseases.',
              '🌿 PLANT SPACING: Proper spacing allows good air circulation, reducing humidity that favors fungal diseases. Crowded plants create microclimates that promote disease development. Follow recommended spacing guidelines.',
              '🔄 SANITATION: Remove diseased plant debris promptly. Don\'t compost diseased material unless you have a hot compost pile. Clean tools between plants to prevent disease spread. Start with clean, disease-free seeds and plants.',
              '🌱 SOIL AMENDMENTS: Add beneficial microbes through compost and organic matter. These compete with harmful pathogens. Some amendments like biochar can improve soil health and plant resistance.',
              '⏰ TIMING: Plant at the right time for your climate. Plants stressed by weather extremes are more susceptible to diseases. Avoid planting when conditions favor disease development.'
            ]
          },
          {
            id: 18,
            title: 'Treatment Strategies - When Prevention Fails',
            content: 'When diseases do occur, proper treatment can save plants and prevent spread. Here are effective treatment strategies:',
            points: [
              '🔍 EARLY DETECTION: Learn to recognize early disease symptoms. Yellowing leaves, spots, wilting, or stunted growth can indicate disease. Early intervention is more successful than waiting for severe symptoms.',
              '✂️ CULTURAL CONTROLS: Remove infected plant parts promptly. Prune diseased branches back to healthy tissue. Improve growing conditions (better drainage, proper watering, adequate nutrition) to help plants recover.',
              '🌿 ORGANIC TREATMENTS: Use organic fungicides like copper, sulfur, or neem oil for fungal diseases. These are less harmful to beneficial organisms than synthetic chemicals. Always follow label directions.',
              '🦠 BIOLOGICAL CONTROLS: Introduce beneficial organisms that compete with or attack disease-causing pathogens. Some beneficial bacteria and fungi can be added to soil to improve plant health.',
              '🧪 CHEMICAL CONTROLS: Use synthetic fungicides as a last resort and only when necessary. Choose products specific to the disease you\'re treating. Rotate different chemical classes to prevent resistance.',
              '📊 RECORD KEEPING: Keep records of diseases that occur in your garden. Note which plants were affected, when, and what treatments were used. This helps you plan better prevention strategies for the future.'
            ]
          }
        ],
        quiz: {
          title: 'Plant Disease & Soil Management Quiz',
          questions: [
            {
              id: 16,
              question: '🦠 DISEASE IDENTIFICATION: This plant shows wilting, yellowing leaves, and brown discoloration in the stem. The soil is waterlogged. What is the most likely cause?',
              image: '/images/quiz/quiz-root-rot-symptoms.jpg',
              imageDescription: 'Plant showing wilting, yellowing leaves, and stem discoloration in waterlogged soil conditions',
              options: ['Nutrient deficiency', 'Root rot disease', 'Too much sunlight', 'Insect damage'],
              correct: 1,
              explanation: '✅ CORRECT! These symptoms indicate root rot disease, which is common in waterlogged soil. Root rot fungi thrive in wet, poorly drained soil and cause wilting, yellowing, and stem discoloration as they damage the root system.'
            },
            {
              id: 17,
              question: '🌱 PREVENTIVE MEASURES: What is the most effective way to prevent soil-borne plant diseases?',
              options: ['Use more fertilizer', 'Improve soil drainage and structure', 'Plant closer together', 'Water more frequently'],
              correct: 1,
              explanation: '✅ CORRECT! Improving soil drainage and structure is the most effective way to prevent soil-borne diseases. Well-drained soil with good structure prevents waterlogging that favors disease-causing pathogens and promotes healthy root development.'
            },
            {
              id: 18,
              question: '🔄 CROP ROTATION: Why is crop rotation important for disease prevention?',
              options: ['It saves water', 'It breaks disease cycles and prevents pathogen buildup', 'It makes plants grow faster', 'It reduces fertilizer needs'],
              correct: 1,
              explanation: '✅ CORRECT! Crop rotation breaks disease cycles by preventing the buildup of soil-borne pathogens that are specific to certain plant families. This is especially important for diseases that can survive in soil for multiple years.'
            }
          ]
        }
      }
    ],
    'Expert': [
      {
        id: 'professional-soil-analysis',
        title: 'Professional Soil Analysis - The Science of Soil Health',
        difficulty: 'Expert',
        estimatedTime: '60 min',
        description: 'Master professional soil testing, analysis techniques, and advanced soil management for optimal plant health and productivity',
        lessons: [
          {
            id: 19,
            title: 'Professional Soil Testing Methods - Laboratory Analysis',
            content: 'Professional soil analysis goes beyond simple pH tests. Here\'s how to conduct comprehensive soil testing for optimal plant health:',
            points: [
              '🧪 LABORATORY TESTING: Send soil samples to professional labs for comprehensive analysis. Tests include pH, nutrient levels, organic matter, CEC, and micronutrients. This provides the most accurate and detailed information.',
              '📊 SAMPLING TECHNIQUES: Take multiple samples from different areas, mix them together, and send a composite sample. Avoid areas near buildings, roads, or where fertilizers were recently applied. Sample depth should match root zone depth.',
              '🌱 FIELD TESTING: Use portable meters for pH, moisture, and light. These provide quick, on-site results but may be less accurate than lab tests. Good for regular monitoring and quick assessments.',
              '🔬 SOIL STRUCTURE ANALYSIS: Assess soil texture, compaction, drainage, and root penetration. Use simple tests like the ribbon test for texture, infiltration test for drainage, and penetration test for compaction.',
              '🦠 BIOLOGICAL TESTING: Assess soil microbial activity, earthworm populations, and organic matter decomposition. Healthy soil has active biological life. Use simple tests like the tea bag test for decomposition rates.',
              '📈 INTERPRETING RESULTS: Compare results to optimal ranges for your plants. Consider seasonal variations, recent amendments, and plant performance. Use results to develop a soil improvement plan.'
            ]
          },
          {
            id: 20,
            title: 'Advanced Nutrient Analysis - Understanding Plant Nutrition',
            content: 'Understanding nutrient analysis helps you provide exactly what your plants need for optimal growth and health:',
            points: [
              '📊 NUTRIENT RATIOS: Plants need nutrients in specific ratios. N-P-K ratios vary by plant type and growth stage. Leafy plants need more nitrogen, flowering plants need more phosphorus, fruiting plants need more potassium.',
              '⚡ NUTRIENT AVAILABILITY: Soil pH affects nutrient availability. Most nutrients are available at pH 6.0-7.0. Some nutrients become unavailable at extreme pH levels. Adjust pH to optimize nutrient uptake.',
              '🔄 NUTRIENT CYCLING: Understand how nutrients move through the soil-plant system. Some nutrients are mobile (move with water), others are immobile (stay in place). This affects how and when to apply fertilizers.',
              '🌱 PLANT TISSUE TESTING: Analyze plant tissue to see what nutrients plants are actually taking up. This complements soil testing and helps identify nutrient deficiencies or toxicities. Test leaves during active growth.',
              '💧 FERTILIZER CALCULATIONS: Calculate exact fertilizer needs based on soil test results and plant requirements. Consider nutrient release rates, application timing, and environmental factors. Avoid over-fertilization.',
              '🔄 LONG-TERM MONITORING: Track nutrient levels over time to see how your soil improvement efforts are working. Regular testing helps you maintain optimal soil fertility and catch problems early.'
            ]
          },
          {
            id: 21,
            title: 'Soil Remediation Strategies - Fixing Complex Problems',
            content: 'When soil tests reveal problems, here are proven strategies for remediation and improvement:',
            points: [
              '🌱 pH ADJUSTMENT: Add lime to raise pH (make less acidic), add sulfur to lower pH (make more acidic). Changes take time - test again in 6-12 months. Make gradual adjustments to avoid shocking plants.',
              '💧 DRAINAGE IMPROVEMENT: Install drainage systems, add organic matter, create raised beds, or use plants that tolerate wet conditions. Poor drainage is a common problem that affects plant health and nutrient availability.',
              '🌿 COMPACTION REMEDIATION: Use deep tillage, add organic matter, plant cover crops with deep roots, or use mechanical aeration. Compacted soil restricts root growth and reduces water and nutrient availability.',
              '🔄 SALINITY MANAGEMENT: Leach excess salts with deep watering, add organic matter, use salt-tolerant plants, or improve drainage. High salinity can damage plants and reduce nutrient availability.',
              '🦠 BIOLOGICAL RESTORATION: Add compost, use cover crops, avoid chemical inputs, and encourage beneficial microbes. Healthy soil biology is essential for plant health and nutrient cycling.',
              '📊 MONITORING PROGRESS: Track improvements over time with regular testing. Soil improvement is a long-term process that requires patience and persistence. Celebrate small improvements and stay committed to the process.'
            ]
          }
        ],
        quiz: {
          title: 'Professional Soil Analysis Quiz',
          questions: [
            {
              id: 19,
              question: '🧪 SOIL TEST INTERPRETATION: This soil test report shows a CEC of 8. What does this indicate?',
              image: '/images/quiz/quiz-soil-test-report.jpg',
              imageDescription: 'Professional soil test report showing CEC (Cation Exchange Capacity) value of 8',
              options: ['High nutrient holding capacity', 'Low nutrient holding capacity', 'Perfect pH level', 'High organic matter'],
              correct: 1,
              explanation: '✅ CORRECT! A CEC (Cation Exchange Capacity) of 8 indicates low nutrient holding capacity. This soil will need more frequent fertilization as nutrients will leach away quickly. High CEC soils (20+) hold nutrients much better.'
            },
            {
              id: 20,
              question: '📊 NUTRIENT ANALYSIS: This plant tissue test shows high nitrogen but low phosphorus levels. What should you do?',
              image: '/images/quiz/quiz-plant-tissue-test.jpg',
              imageDescription: 'Plant tissue analysis results showing nutrient levels in plant leaves',
              options: ['Add more nitrogen', 'Apply phosphorus-rich fertilizer', 'Reduce watering', 'Increase sunlight'],
              correct: 1,
              explanation: '✅ CORRECT! The plant tissue test shows the plant is taking up plenty of nitrogen but not enough phosphorus. Apply a phosphorus-rich fertilizer (like 10-20-10) to address this specific deficiency and improve flowering/fruiting.'
            },
            {
              id: 21,
              question: '🌱 SOIL REMEDIATION: This soil is heavily compacted with poor drainage. What is the best long-term solution?',
              image: '/images/quiz/quiz-compacted-soil.jpg',
              imageDescription: 'Heavily compacted soil showing poor structure and drainage issues',
              options: ['Add more water', 'Add organic matter and use cover crops', 'Use more fertilizer', 'Plant deeper'],
              correct: 1,
              explanation: '✅ CORRECT! Adding organic matter and using cover crops with deep roots is the best long-term solution for compacted soil. This improves soil structure, drainage, and biological activity, creating lasting improvements rather than temporary fixes.'
            }
          ]
        }
      },
      {
        id: 'advanced-plant-physiology',
        title: 'Advanced Plant Physiology - Understanding Plant Biology',
        difficulty: 'Expert',
        estimatedTime: '65 min',
        description: 'Master the complex biological processes that govern plant growth, development, and response to environmental conditions',
        lessons: [
          {
            id: 22,
            title: 'Plant Growth & Development - The Biological Foundation',
            content: 'Understanding plant physiology helps you provide optimal growing conditions and troubleshoot problems effectively:',
            points: [
              '🌱 PHOTOSYNTHESIS: The process by which plants convert light energy into chemical energy. Requires light, carbon dioxide, and water. Understanding this process helps optimize light conditions and CO2 levels for maximum growth.',
              '💧 TRANSPIRATION: The process by which plants lose water through their leaves. This creates a "pull" that draws water and nutrients from roots. High humidity reduces transpiration, while low humidity increases it.',
              '🌿 NUTRIENT UPTAKE: Plants absorb nutrients through their roots via active transport and passive diffusion. Root health is crucial for nutrient uptake. Mycorrhizal fungi can extend the root system and improve nutrient absorption.',
              '🔄 PLANT HORMONES: Auxins (growth), Cytokinins (cell division), Gibberellins (stem elongation), Abscisic acid (stress response). Understanding these helps explain plant responses to pruning, stress, and environmental changes.',
              '⏰ PHOTOPERIODISM: How plants respond to day length. Short-day plants flower when days are short, long-day plants flower when days are long. This affects when to plant and how to manage flowering.',
              '🌡️ THERMOPERIODISM: How plants respond to temperature changes. Many plants need specific temperature ranges for optimal growth, flowering, and fruiting. Understanding this helps with timing and location decisions.'
            ]
          },
          {
            id: 23,
            title: 'Plant Stress Response - Reading Plant Signals',
            content: 'Plants communicate their needs and problems through visible signs. Learning to read these signals is crucial for expert plant care:',
            points: [
              '🔍 STRESS INDICATORS: Wilting (water stress), Yellowing (nutrient deficiency), Browning (toxicity or disease), Stunted growth (root problems), Leaf drop (environmental stress). Each symptom tells a story about what the plant needs.',
              '💧 WATER STRESS: Underwatering causes wilting, yellowing, and stunted growth. Overwatering causes root rot, yellowing, and leaf drop. Learn to distinguish between these symptoms for proper treatment.',
              '🌱 NUTRIENT STRESS: Different nutrients cause different deficiency symptoms. Nitrogen deficiency causes overall yellowing, phosphorus deficiency causes purple leaves, potassium deficiency causes brown leaf edges.',
              '🌡️ ENVIRONMENTAL STRESS: Temperature extremes, humidity problems, light issues, and air pollution all cause specific symptoms. Understanding these helps you adjust growing conditions appropriately.',
              '🦠 BIOTIC STRESS: Pests and diseases cause characteristic symptoms. Learn to distinguish between pest damage, disease symptoms, and environmental problems for effective treatment.',
              '⏰ TIMING OF SYMPTOMS: When symptoms appear can provide clues about the cause. Sudden symptoms often indicate environmental stress, while gradual symptoms may indicate nutrient deficiencies or diseases.'
            ]
          },
          {
            id: 24,
            title: 'Optimizing Plant Performance - The Expert Approach',
            content: 'Combine your knowledge of plant physiology with practical techniques to achieve maximum plant health and productivity:',
            points: [
              '🎯 PRECISION CULTURE: Use your understanding of plant physiology to create optimal growing conditions. Adjust light, temperature, humidity, and nutrition based on plant needs and growth stage.',
              '🌱 GROWTH STAGE MANAGEMENT: Different growth stages have different needs. Seedlings need gentle conditions, vegetative growth needs high nitrogen, flowering needs high phosphorus, fruiting needs high potassium.',
              '💧 WATER OPTIMIZATION: Understand transpiration rates and adjust watering accordingly. Use techniques like deep watering, mulching, and proper drainage to optimize water use and plant health.',
              '🌿 NUTRIENT TIMING: Apply nutrients when plants can use them most effectively. Match nutrient applications to growth stages and environmental conditions for maximum efficiency.',
              '🔄 STRESS MANAGEMENT: Use your knowledge of plant stress responses to prevent problems before they occur. Create stable growing conditions and monitor plants regularly for early signs of stress.',
              '📊 PERFORMANCE MONITORING: Track plant performance over time to identify what works best in your specific conditions. Keep detailed records of growing conditions, treatments, and results.'
            ]
          }
        ],
        quiz: {
          title: 'Advanced Plant Physiology Quiz',
          questions: [
            {
              id: 22,
              question: '🌱 PLANT PROCESSES: This plant is showing rapid growth but no flowers. What process is likely dominating?',
              image: '/images/quiz/quiz-vegetative-growth.jpg',
              imageDescription: 'Plant showing vigorous vegetative growth with large leaves but no flowering',
              options: ['Photosynthesis (energy production)', 'Vegetative growth (auxin dominance)', 'Flowering (gibberellin activity)', 'Root development (cytokinin activity)'],
              correct: 1,
              explanation: '✅ CORRECT! Rapid vegetative growth without flowering indicates auxin dominance, which promotes stem and leaf growth while inhibiting flowering. This is common in young plants or when nitrogen levels are high.'
            },
            {
              id: 23,
              question: '🔍 STRESS DIAGNOSIS: This plant shows yellowing between leaf veins while veins remain green. What is the most likely cause?',
              image: '/images/quiz/quiz-interveinal-chlorosis.jpg',
              imageDescription: 'Plant leaves showing interveinal chlorosis - yellowing between green veins',
              options: ['Nitrogen deficiency (overall yellowing)', 'Iron deficiency (interveinal chlorosis)', 'Overwatering (root rot)', 'Too much light (leaf burn)'],
              correct: 1,
              explanation: '✅ CORRECT! Interveinal chlorosis (yellowing between green veins) is a classic sign of iron deficiency. This is common in alkaline soils where iron becomes unavailable to plants, or in plants with poor root health.'
            },
            {
              id: 24,
              question: '🌡️ ENVIRONMENTAL RESPONSE: This plant is dropping leaves rapidly after being moved to a new location. What is the most likely cause?',
              image: '/images/quiz/quiz-leaf-drop.jpg',
              imageDescription: 'Plant showing rapid leaf drop after environmental change',
              options: ['Nutrient deficiency', 'Environmental stress (shock)', 'Pest infestation', 'Disease infection'],
              correct: 1,
              explanation: '✅ CORRECT! Rapid leaf drop after moving a plant is typically caused by environmental stress or shock. Plants respond to sudden changes in light, temperature, or humidity by dropping leaves to conserve energy and water.'
            }
          ]
        }
      },
      {
        id: 'sustainable-gardening-systems',
        title: 'Sustainable Gardening Systems - The Future of Plant Care',
        difficulty: 'Expert',
        estimatedTime: '70 min',
        description: 'Design and implement sustainable gardening systems that work with nature for long-term success',
        lessons: [
          {
            id: 25,
            title: 'Ecosystem Design - Working with Nature',
            content: 'Create gardens that function as complete ecosystems, reducing maintenance while improving plant health:',
            points: [
              '🌿 PERMACULTURE PRINCIPLES: Design gardens that mimic natural ecosystems. Use companion planting, polycultures, and beneficial relationships between plants, animals, and microorganisms for sustainable success.',
              '🔄 NUTRIENT CYCLING: Create closed-loop systems where waste becomes resources. Use compost, cover crops, and plant diversity to maintain soil fertility without external inputs. This reduces costs and environmental impact.',
              '🌱 BIODIVERSITY: Increase plant and animal diversity to create resilient ecosystems. Different plants attract different beneficial insects, improve soil health, and provide multiple functions. This creates natural pest control and pollination.',
              '💧 WATER MANAGEMENT: Design systems that capture, store, and efficiently use water. Use swales, rain gardens, and water-wise plants to create drought-resistant gardens that work with natural water cycles.',
              '🦠 SOIL FOOD WEB: Foster beneficial soil microorganisms that support plant health. Use compost, avoid chemicals, and maintain soil organic matter to create thriving soil ecosystems that naturally suppress diseases and pests.',
              '🌍 CLIMATE ADAPTATION: Choose plants and techniques that work with your local climate and conditions. Use native plants, microclimates, and seasonal planning to create gardens that thrive with minimal intervention.'
            ]
          },
          {
            id: 26,
            title: 'Advanced Soil Building - Creating Living Soil',
            content: 'Build and maintain soil that gets better over time through natural processes and minimal intervention:',
            points: [
              '🌱 NO-TILL GARDENING: Minimize soil disturbance to preserve soil structure and beneficial microorganisms. Use techniques like sheet mulching, cover crops, and surface applications to build soil without tilling.',
              '🔄 COMPOST SYSTEMS: Create multiple compost systems for different purposes. Hot compost for quick breakdown, cold compost for slow release, and vermicompost for nutrient-rich amendments. This provides continuous soil improvement.',
              '🌿 COVER CROPS: Use living plants to build soil, suppress weeds, and provide nutrients. Choose cover crops based on your needs: nitrogen fixation, organic matter, weed suppression, or specific nutrient contributions.',
              '🦠 MICROBIAL INOCULANTS: Introduce beneficial microorganisms to jumpstart soil health. Use compost tea, mycorrhizal fungi, and beneficial bacteria to establish healthy soil ecosystems that support plant growth.',
              '🌱 MULCHING SYSTEMS: Use organic mulches to protect soil, retain moisture, and provide nutrients. Different mulches serve different purposes: straw for vegetables, wood chips for perennials, leaves for acid-loving plants.',
              '📊 SOIL MONITORING: Track soil health over time using simple tests and observations. Monitor organic matter, biological activity, and plant performance to ensure your soil-building efforts are working effectively.'
            ]
          },
          {
            id: 27,
            title: 'Long-term Garden Management - Sustainable Success',
            content: 'Develop systems and strategies for maintaining healthy, productive gardens with minimal ongoing effort:',
            points: [
              '📅 SEASONAL PLANNING: Create year-round garden plans that maximize productivity while maintaining soil health. Use succession planting, crop rotation, and seasonal cover crops to keep gardens productive and healthy.',
              '🌱 PLANT SELECTION: Choose plants that are well-adapted to your conditions and provide multiple benefits. Select for disease resistance, low maintenance, and ecosystem value. This reduces problems and increases success.',
              '🔄 MAINTENANCE SYSTEMS: Develop efficient routines for garden care that work with natural processes. Use techniques like chop-and-drop mulching, integrated pest management, and minimal intervention approaches.',
              '🌿 PROBLEM PREVENTION: Design gardens to prevent common problems before they occur. Use diversity, proper spacing, and healthy soil to create conditions that naturally suppress diseases and pests.',
              '💧 RESOURCE EFFICIENCY: Maximize the use of available resources like water, nutrients, and space. Use techniques like intercropping, vertical gardening, and water-wise design to get maximum results from minimal inputs.',
              '📊 CONTINUOUS IMPROVEMENT: Regularly assess and improve your garden systems. Keep records, experiment with new techniques, and adapt your approach based on results. This ensures long-term success and learning.'
            ]
          }
        ],
        quiz: {
          title: 'Sustainable Gardening Systems Quiz',
          questions: [
            {
              id: 25,
              question: '🌿 ECOSYSTEM DESIGN: This garden shows multiple plant types growing together with no bare soil visible. What principle is being demonstrated?',
              image: '/images/quiz/quiz-polyculture-garden.jpg',
              imageDescription: 'Diverse garden with multiple plant types growing together in a natural, layered arrangement',
              options: ['Monoculture (single crop)', 'Polyculture (multiple crops)', 'Container gardening', 'Hydroponic growing'],
              correct: 1,
              explanation: '✅ CORRECT! This garden demonstrates polyculture - growing multiple plant types together. This creates biodiversity, improves soil health, and provides natural pest control, making the garden more resilient and sustainable.'
            },
            {
              id: 26,
              question: '🔄 SOIL BUILDING: This garden shows plants growing through a thick layer of organic material. What technique is being used?',
              image: '/images/quiz/quiz-mulched-garden.jpg',
              imageDescription: 'Garden with plants growing through a thick layer of organic mulch material',
              options: ['Chemical fertilization', 'Sheet mulching', 'Tilling and cultivation', 'Hydroponic growing'],
              correct: 1,
              explanation: '✅ CORRECT! This garden uses sheet mulching - covering the soil with organic materials. This builds soil, suppresses weeds, retains moisture, and provides nutrients as the mulch decomposes, creating a sustainable soil-building system.'
            },
            {
              id: 27,
              question: '🌱 SUSTAINABLE PRACTICES: This garden shows plants at different growth stages in the same bed. What technique is being demonstrated?',
              image: '/images/quiz/quiz-succession-planting.jpg',
              imageDescription: 'Garden bed showing plants at different growth stages, indicating continuous planting',
              options: ['Single planting', 'Succession planting', 'Transplanting', 'Seed saving'],
              correct: 1,
              explanation: '✅ CORRECT! This garden demonstrates succession planting - planting crops at different times to ensure continuous harvest. This maximizes productivity, maintains soil health, and provides a steady supply of fresh produce throughout the growing season.'
            }
          ]
        }
      }
    ]
  }
}

export const getModuleData = (difficulty) => {
  const allModules = getLearningPathModules()
  return allModules[difficulty] || []
}
