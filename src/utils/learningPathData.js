// Learning Path Data Utility
// This file contains the actual module data from the learning path files

export const getLearningPathModules = () => {
  return {
    'Beginner': [
      {
        id: 'intro',
        title: 'Introduction to Planting',
        difficulty: 'Beginner',
        estimatedTime: '25 min',
        description: 'Master the fundamentals of plant types, life cycles, and choosing your first plants with confidence',
        lessons: [
          { title: 'Understanding Plant Types & Life Cycles', content: 'Plants are categorized into three main types based on their life cycle...' },
          { title: 'Choosing Beginner-Friendly Plants - The Success Formula', content: 'Selecting the right plants for your first garden...' },
          { title: 'Starting Small Strategy - Building Your Gardening Foundation', content: 'The key to gardening success is building confidence...' }
        ],
        quiz: {
          title: 'Beginner Basics Quiz',
          questions: [
            { question: 'Which plant completes its life cycle in one season?', options: ['Annual', 'Perennial', 'Biennial'], correct: 0 },
            { question: 'Which herb is known for vigorous growth and is hard to kill?', options: ['Basil', 'Mint', 'Parsley'], correct: 1 }
          ]
        }
      },
      {
        id: 'light',
        title: 'Light Basics - The Foundation of Plant Health',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        description: 'Master the art of providing proper light for your plants - the most critical factor for plant success',
        lessons: [
          { title: 'Understanding Light Requirements - The Plant Energy System', content: 'Light is to plants what food is to humans...' },
          { title: 'Indoor Light Management - Maximizing Your Home\'s Light', content: 'Indoor gardening requires understanding how light behaves...' },
          { title: 'Low-Light Plant Champions - Thriving in Dim Conditions', content: 'Not every home has bright, sunny windows...' }
        ],
        quiz: {
          title: 'Light Requirements Quiz',
          questions: [
            { question: 'How many hours of direct sunlight do full sun plants need?', options: ['2-4 hours', '6-8+ hours', '1-2 hours'], correct: 1 },
            { question: 'Which window orientation provides the gentlest light?', options: ['South', 'East', 'West'], correct: 1 }
          ]
        }
      },
      {
        id: 'soil',
        title: 'Soil & Containers - The Foundation of Plant Success',
        difficulty: 'Beginner',
        estimatedTime: '25 min',
        description: 'Learn about soil types, container selection, and soil amendments for healthy plant growth',
        lessons: [
          { title: 'Choosing the Right Soil - The Plant\'s Home', content: 'Soil is more than just dirt - it\'s your plant\'s home...' },
          { title: 'Container Selection', content: 'The right container makes all the difference...' },
          { title: 'Soil Amendments', content: 'Improve your soil with these additions...' }
        ],
        quiz: {
          title: 'Soil & Containers Quiz',
          questions: [
            { question: 'What is the most important feature of a good container?', options: ['Color', 'Drainage holes', 'Size'], correct: 1 },
            { question: 'What does perlite do for soil?', options: ['Adds nutrients', 'Improves drainage', 'Retains water'], correct: 1 }
          ]
        }
      },
      {
        id: 'water',
        title: 'Watering Fundamentals',
        difficulty: 'Beginner',
        estimatedTime: '20 min',
        description: 'Master the art of proper watering - the key to plant health and growth',
        lessons: [
          { title: 'Watering Principles', content: 'The golden rules of watering...' },
          { title: 'The Finger Test', content: 'The simplest way to check if your plant needs water...' },
          { title: 'Watering Techniques', content: 'Proper watering methods for different situations...' }
        ],
        quiz: {
          title: 'Watering Quiz',
          questions: [
            { question: 'What is the best way to check if a plant needs water?', options: ['Finger test', 'Calendar schedule', 'Visual inspection'], correct: 0 },
            { question: 'When is the best time to water plants?', options: ['Evening', 'Morning', 'Midday'], correct: 1 }
          ]
        }
      },
      {
        id: 'climate',
        title: 'Temperature & Humidity',
        difficulty: 'Beginner',
        estimatedTime: '20 min',
        description: 'Understanding how temperature and humidity affect plant health and growth',
        lessons: [
          { title: 'Optimal Temperature Ranges', content: 'Most plants thrive in specific temperature ranges...' },
          { title: 'Humidity Management', content: 'Humidity is crucial for many plants...' },
          { title: 'Seasonal Adjustments', content: 'Adapt your care to seasonal changes...' }
        ],
        quiz: {
          title: 'Temperature & Humidity Quiz',
          questions: [
            { question: 'What temperature range do most houseplants prefer?', options: ['50-60°F', '65-75°F', '80-90°F'], correct: 1 },
            { question: 'How can you increase humidity for plants?', options: ['More water', 'Humidifier', 'Less light'], correct: 1 }
          ]
        }
      },
      {
        id: 'starter',
        title: 'Starter Plants & Easy Wins',
        difficulty: 'Beginner',
        estimatedTime: '25 min',
        description: 'Begin with these forgiving plants that will build your confidence and gardening skills',
        lessons: [
          { title: 'Herb Garden Essentials', content: 'Start with these easy-to-grow herbs...' },
          { title: 'Beginner Vegetables', content: 'These vegetables are forgiving for new gardeners...' },
          { title: 'Easy Houseplants', content: 'Perfect indoor plants for beginners...' }
        ],
        quiz: {
          title: 'Starter Plants Quiz',
          questions: [
            { question: 'Which herb is known for being very easy to grow?', options: ['Basil', 'Mint', 'Rosemary'], correct: 1 },
            { question: 'What is a good beginner vegetable?', options: ['Lettuce', 'Tomatoes', 'Peppers'], correct: 0 }
          ]
        }
      },
      {
        id: 'problems',
        title: 'Common Problems & Quick Fixes',
        difficulty: 'Beginner',
        estimatedTime: '25 min',
        description: 'Learn to identify and solve common plant problems before they become serious',
        lessons: [
          { title: 'Yellow Leaves Diagnosis', content: 'Yellow leaves can indicate several issues...' },
          { title: 'Growth Problems', content: 'Identify and fix growth issues...' },
          { title: 'Quick Fixes', content: 'Simple solutions for common problems...' }
        ],
        quiz: {
          title: 'Problem Solving Quiz',
          questions: [
            { question: 'What does yellowing leaves usually indicate?', options: ['Too much water', 'Not enough light', 'Both A and B'], correct: 2 },
            { question: 'What causes leggy growth in plants?', options: ['Too much water', 'Not enough light', 'Too much fertilizer'], correct: 1 }
          ]
        }
      },
      {
        id: 'tools',
        title: 'Essential Gardening Tools',
        difficulty: 'Beginner',
        estimatedTime: '20 min',
        description: 'Discover the must-have tools for successful gardening and how to care for them',
        lessons: [
          { title: 'Must-Have Tools', content: 'Start with these essential gardening tools...' },
          { title: 'Tool Care', content: 'Keep your tools in good condition...' },
          { title: 'Budget-Friendly Options', content: 'Start gardening without breaking the bank...' }
        ],
        quiz: {
          title: 'Gardening Tools Quiz',
          questions: [
            { question: 'What is the most essential gardening tool?', options: ['Trowel', 'Watering can', 'Pruners'], correct: 0 },
            { question: 'How should you clean your gardening tools?', options: ['Soap and water', 'Bleach solution', 'Just rinse'], correct: 0 }
          ]
        }
      },
      {
        id: 'seeds',
        title: 'Starting from Seeds',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        description: 'Learn the rewarding process of growing plants from seeds - from selection to harvest',
        lessons: [
          { title: 'Choosing Seeds', content: 'Pick the right seeds for beginners...' },
          { title: 'Planting Seeds', content: 'Simple steps to plant seeds...' },
          { title: 'Caring for Seedlings', content: 'Help your baby plants grow strong...' }
        ],
        quiz: {
          title: 'Seed Starting Quiz',
          questions: [
            { question: 'What is the best time to start seeds indoors?', options: ['Summer', '6-8 weeks before last frost', 'Winter'], correct: 1 },
            { question: 'How deep should you plant most seeds?', options: ['1 inch', 'Twice their diameter', '6 inches'], correct: 1 }
          ]
        }
      },
      {
        id: 'plant-soil',
        title: 'Plant-Soil Compatibility',
        difficulty: 'Beginner',
        estimatedTime: '30 min',
        description: 'Understanding which plants work best with different soil types and how to match them perfectly',
        lessons: [
          { title: 'Understanding Soil Types - Visual Identification Guide', content: 'Learn to identify different soil types by sight and touch...' },
          { title: 'Plant-Soil Matching - Why It Matters', content: 'Understanding plant-soil compatibility prevents common gardening problems...' },
          { title: 'Visual Identification Guide - What to Look For', content: 'Master the art of identifying soil types by sight...' },
          { title: 'Simple Soil Tests You Can Do at Home', content: 'Learn these easy tests to identify your soil type...' }
        ],
        quiz: {
          title: 'Plant-Soil Matching Quiz',
          questions: [
            { question: 'Which plant prefers well-draining soil?', options: ['Cactus', 'Water Lily', 'Rice'], correct: 0 },
            { question: 'What type of soil is best for vegetables?', options: ['Sandy', 'Clay', 'Loamy'], correct: 2 }
          ]
        }
      },
      {
        id: 'harvest',
        title: 'Harvesting Your Plants',
        difficulty: 'Beginner',
        estimatedTime: '20 min',
        description: 'Learn when and how to harvest your plants for maximum flavor and continued growth',
        lessons: [
          { title: 'When to Harvest', content: 'Know the right time to pick your plants...' },
          { title: 'How to Harvest', content: 'Proper harvesting techniques...' },
          { title: 'Using Your Harvest', content: 'Make the most of what you grow...' }
        ],
        quiz: {
          title: 'Harvesting Quiz',
          questions: [
            { question: 'When should you harvest herbs?', options: ['Before flowering', 'After flowering', 'Anytime'], correct: 0 },
            { question: 'What is the best time of day to harvest?', options: ['Midday', 'Early morning', 'Evening'], correct: 1 }
          ]
        }
      }
    ],
    'Intermediate': [
      {
        id: 'nutrition',
        title: 'Plant Nutrition & Fertilizing - Feeding Your Garden',
        difficulty: 'Intermediate',
        estimatedTime: '35 min',
        description: 'Master the science of plant nutrition and develop smart fertilizing strategies for optimal plant health',
        lessons: [
          {
            id: 7,
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
            id: 8,
            title: 'Types of Plant Food - Choosing the Right Nutrition',
            content: 'Different plants need different types of nutrition, and different situations call for different approaches. Here\'s your guide to plant food options:',
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
            id: 9,
            title: 'When and How to Fertilize - Timing is Everything',
            content: 'Fertilizing at the right time and in the right way makes all the difference. Here\'s how to feed your plants effectively:',
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
          id: 3,
          title: 'Plant Nutrition Quiz',
          questions: [
            {
              id: 7,
              question: 'Which nutrient is most important for leaf and stem growth?',
              options: ['Phosphorus', 'Nitrogen', 'Potassium', 'Calcium'],
              correct: 1,
              explanation: 'Nitrogen is essential for leaf and stem growth and makes leaves green and lush.'
            },
            {
              id: 8,
              question: 'What do the numbers 10-10-10 on a fertilizer package represent?',
              options: ['Price', 'NPK ratio', 'Weight', 'Expiration date'],
              correct: 1,
              explanation: 'The numbers 10-10-10 represent the ratio of Nitrogen-Phosphorus-Potassium in the fertilizer.'
            },
            {
              id: 9,
              question: 'When is the best time to fertilize most plants?',
              options: ['Winter', 'Spring', 'Summer', 'Fall'],
              correct: 1,
              explanation: 'Spring is the best time to fertilize most plants as they start their active growth period.'
            }
          ]
        }
      },
      {
        id: 'advanced-soil-plant-relationships',
        title: 'Advanced Soil-Plant Relationships',
        difficulty: 'Intermediate',
        estimatedTime: '40 min',
        description: 'Deep dive into soil science and plant interactions for advanced gardeners',
        lessons: [
          {
            id: 10,
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
            id: 11,
            title: 'Root Systems - The Hidden Network',
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
            id: 12,
            title: 'Soil Improvement Strategies - Building Better Soil',
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
          id: 4,
          title: 'Advanced Soil Science Quiz',
          questions: [
            {
              id: 10,
              question: 'What does CEC stand for in soil science?',
              options: ['Cation Exchange Capacity', 'Carbon Exchange Content', 'Chemical Element Count', 'Crop Enhancement Coefficient'],
              correct: 0,
              explanation: 'CEC stands for Cation Exchange Capacity, which measures the soil\'s ability to hold nutrients.'
            },
            {
              id: 11,
              question: 'Which element is most important for root development?',
              options: ['Nitrogen', 'Phosphorus', 'Potassium', 'Iron'],
              correct: 1,
              explanation: 'Phosphorus is critical for root development, flowering, and fruiting.'
            },
            {
              id: 12,
              question: 'What is the ideal organic matter content for garden soil?',
              options: ['1-2%', '3-5%', '10-15%', '20-25%'],
              correct: 1,
              explanation: 'The ideal organic matter content for garden soil is 3-5%, which provides good structure and nutrient availability.'
            }
          ]
        }
      }
    ],
    'Expert': [
      {
        id: 'advanced-pruning',
        title: 'Master Pruning Techniques - The Art of Plant Sculpting',
        difficulty: 'Expert',
        estimatedTime: '45 min',
        description: 'Master the art and science of professional pruning - transform your plants into living sculptures',
        lessons: [
          {
            id: 13,
            title: 'Pruning Fundamentals - The Science Behind the Art',
            content: 'Pruning is both an art and a science. It\'s about understanding plant biology, growth patterns, and the delicate balance between encouraging growth and maintaining plant health:',
            points: [
              '⏰ TIMING IS EVERYTHING: Deciduous trees (winter pruning for structure), Evergreens (late winter/early spring), Flowering shrubs (after blooming), Fruit trees (dormant season). Each plant has its optimal pruning window based on its growth cycle and flowering pattern.',
              '✂️ THE PERFECT CUT: Make cuts at a 45-degree angle, 1/4 inch above a bud or branch collar. This promotes healing and prevents disease. Never leave stubs - they become entry points for pests and diseases. Clean, sharp tools make clean cuts.',
              '🛠️ TOOL MASTERY: Hand pruners (branches up to 1/2 inch), Loppers (branches 1/2-2 inches), Pruning saws (larger branches), Pole pruners (high branches). Keep tools sharp and clean. Disinfect between plants to prevent disease spread.',
              '🛡️ SAFETY PROTOCOLS: Wear protective gear (gloves, safety glasses, hard hat for tree work), Check for power lines, Use proper ladder techniques, Never prune alone when working with large trees. Safety first - your health is more important than perfect pruning.',
              '🧠 UNDERSTANDING PLANT RESPONSE: Plants respond to pruning by producing new growth near the cut. This knowledge helps you direct growth where you want it. Pruning stimulates growth, so timing and technique determine the plant\'s response.',
              '🎯 PRUNING OBJECTIVES: Health (remove dead/diseased wood), Structure (improve form and strength), Size control (manage plant size), Flowering (encourage better blooms), Safety (remove hazardous branches). Always have a clear objective before making cuts.'
            ]
          },
          {
            id: 14,
            title: 'Tree Pruning Techniques - Working with Giants',
            content: 'Tree pruning requires special skills and knowledge. Here\'s how to work safely and effectively with large trees:',
            points: [
              '🌳 STRUCTURAL PRUNING: Remove competing leaders, eliminate weak branch attachments, maintain proper branch spacing. This creates strong, healthy tree structure that can withstand storms and age gracefully.',
              '✂️ CROWN THINNING: Remove select branches to improve light penetration and air circulation. Never remove more than 25% of the crown in one year. This reduces wind resistance and improves tree health.',
              '🌿 CROWN RAISING: Remove lower branches to provide clearance for buildings, vehicles, or pedestrians. Maintain at least 2/3 of the tree\'s height in live branches. This improves access while maintaining tree health.',
              '🌱 CROWN REDUCTION: Reduce tree size by cutting back to lateral branches. This is preferable to topping, which creates weak, dangerous growth. Always cut back to a branch that\'s at least 1/3 the diameter of the removed branch.',
              '🛠️ PROPER CUTTING TECHNIQUES: Use the three-cut method for large branches to prevent bark tearing. Make an undercut first, then a top cut, then a final cut at the branch collar. This prevents damage to the trunk.',
              '⏰ TIMING FOR TREES: Most trees are best pruned in late winter or early spring when dormant. Avoid pruning in fall when wounds heal slowly. Some trees (maples, birches) bleed heavily in spring - prune these in summer.'
            ]
          },
          {
            id: 15,
            title: 'Shrub and Hedge Pruning - Creating Living Sculptures',
            content: 'Shrubs and hedges offer endless possibilities for creative pruning. Here\'s how to shape them into living works of art:',
            points: [
              '🌿 HEDGE PRUNING: Maintain a wider base than top to allow light to reach lower branches. Use string lines for straight edges, templates for curves. Prune regularly to maintain shape and density. Avoid cutting into old wood on some species.',
              '🌸 FLOWERING SHRUBS: Prune after flowering to avoid removing next year\'s flower buds. Some shrubs flower on new wood (prune in late winter), others on old wood (prune after flowering). Know your plant\'s flowering habit.',
              '🌱 RENOVATION PRUNING: Rejuvenate overgrown shrubs by removing 1/3 of the oldest stems each year for 3 years. This maintains the plant while gradually renewing it. Some shrubs can be cut back hard to the ground.',
              '🎨 TOPIARY AND SCULPTURE: Start with simple shapes and work up to complex designs. Use wire frames as guides, prune regularly to maintain shape. Choose plants that respond well to frequent pruning and have small leaves.',
              '🔄 MAINTENANCE PRUNING: Regular light pruning is better than occasional heavy pruning. Remove dead, diseased, or crossing branches. Maintain the plant\'s natural shape while controlling size. This keeps plants healthy and attractive.',
              '💡 CREATIVE PRUNING: Use pruning to create focal points, frame views, or add architectural interest. Espalier fruit trees against walls, create living fences, or shape shrubs into geometric forms. The possibilities are endless.'
            ]
          }
        ],
        quiz: {
          id: 5,
          title: 'Master Pruning Quiz',
          questions: [
            {
              id: 13,
              question: 'What is the best time to prune most deciduous trees?',
              options: ['Spring', 'Summer', 'Fall', 'Winter'],
              correct: 3,
              explanation: 'Most deciduous trees are best pruned in winter when dormant, as this promotes healing and reduces stress.'
            },
              {
              id: 14,
              question: 'What is the golden ratio in garden design?',
              options: ['1:1', '1:1.618', '2:1', '3:1'],
              correct: 1,
              explanation: 'The golden ratio (1:1.618) is a mathematical proportion that creates visually pleasing and harmonious designs.'
            },
            {
              id: 15,
              question: 'Which design principle creates visual flow?',
              options: ['Repetition', 'Contrast', 'Rhythm', 'Balance'],
              correct: 2,
              explanation: 'Rhythm creates visual flow by repeating elements in a pattern that guides the eye through the design.'
            }
          ]
        }
      },
      {
        id: 'professional-soil-analysis',
        title: 'Professional Soil Analysis - The Science of Soil Health',
        difficulty: 'Expert',
        estimatedTime: '50 min',
        description: 'Advanced soil testing and analysis techniques for professional-level gardening',
        lessons: [
          {
            id: 16,
            title: 'Soil Testing Methods - Professional Analysis Techniques',
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
            id: 17,
            title: 'Nutrient Analysis - Understanding Plant Nutrition',
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
            id: 18,
            title: 'Remediation Strategies - Fixing Soil Problems',
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
          id: 6,
          title: 'Professional Soil Analysis Quiz',
          questions: [
            {
              id: 16,
              question: 'What does CEC stand for in soil analysis?',
              options: ['Cation Exchange Capacity', 'Carbon Exchange Content', 'Chemical Element Count', 'Crop Enhancement Coefficient'],
              correct: 0,
              explanation: 'CEC stands for Cation Exchange Capacity, which measures the soil\'s ability to hold and exchange nutrients.'
            },
            {
              id: 17,
              question: 'Which test measures soil acidity?',
              options: ['EC Test', 'pH Test', 'NPK Test', 'Organic Matter Test'],
              correct: 1,
              explanation: 'The pH test measures soil acidity or alkalinity, which affects nutrient availability to plants.'
            },
            {
              id: 18,
              question: 'What is the ideal pH range for most garden plants?',
              options: ['4.0-5.0', '5.0-6.0', '6.0-7.0', '7.0-8.0'],
              correct: 2,
              explanation: 'Most garden plants prefer a pH range of 6.0-7.0, which is slightly acidic to neutral.'
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
