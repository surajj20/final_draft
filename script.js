// Description: This JavaScript file handles the interactivity for the Smart Crop Advisor website. It processes form inputs, generates recommendations using mock logic, toggles dark mode, and handles disease detection. Includes event listeners for form submission, theme toggle. Updated for professionalism: added loading states, error handling, detailed recommendations, and accessibility. Removed weather and PDF report features, and region field.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('farm-form');
    const recommendations = document.getElementById('recommendations');
    const toolsSection = document.getElementById('tools-fertilizers');
    const themeToggle = document.getElementById('theme-toggle');
    const diseaseForm = document.getElementById('disease-form');
    const diseaseResult = document.getElementById('disease-result');
    const submitBtn = document.getElementById('submit-btn');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Mock data for recommendations (in a real app, this could be from an API)
    const cropData = {
        clay: { 
            crops: ['Rice', 'Wheat'], 
            alternatives: ['Corn'], 
            methods: 'Drip irrigation for water efficiency and organic farming to improve soil structure.', 
            rotation: 'Rotate with legumes like soybeans to fix nitrogen and prevent soil compaction.' 
        },
        sandy: { 
            crops: ['Potatoes', 'Carrots'], 
            alternatives: ['Tomatoes'], 
            methods: 'Mulching to retain moisture and organic fertilizers to enhance nutrient retention.', 
            rotation: 'Rotate with greens like lettuce to build organic matter.' 
        },
        loamy: { 
            crops: ['Maize', 'Soybeans'], 
            alternatives: ['Barley'], 
            methods: 'Organic farming with crop rotation for balanced nutrients.', 
            rotation: 'Rotate with root crops like carrots to maintain soil health.' 
        },
        silt: { 
            crops: ['Rice', 'Sugarcane'], 
            alternatives: ['Wheat'], 
            methods: 'Flood irrigation for rice and integrated pest management.', 
            rotation: 'Rotate with cereals like barley for disease prevention.' 
        }
    };

    // Image URLs for crops (placeholders from Unsplash; replace with your own if needed)
    const cropImages = {
        'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=100&fit=crop',
        'Wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=150&h=100&fit=crop',
        'Corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=150&h=100&fit=crop',
        'Potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150&h=100&fit=crop',
        'Carrots': 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=150&h=100&fit=crop',
        'Tomatoes': 'https://images.unsplash.com/photo-1546470427-e9e8526c0e4b?w=150&h=100&fit=crop',
        'Maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=150&h=100&fit=crop', // Same as Corn
        'Soybeans': 'https://images.unsplash.com/photo-1592982375566-7b3930a7e6e5?w=150&h=100&fit=crop',
        'Barley': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=150&h=100&fit=crop',
        'Sugarcane': 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=150&h=100&fit=crop'
    };

    // Form submission handler with loading state
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');

        try {
            const soilType = document.getElementById('soil-type').value;
            const ph = parseFloat(document.getElementById('ph-level').value);
            const moisture = parseInt(document.getElementById('moisture').value);
            const temp = parseInt(document.getElementById('temperature').value);
            const rainfall = parseInt(document.getElementById('rainfall').value);
            const humidity = parseInt(document.getElementById('humidity').value);
            const waterSource = document.getElementById('water-source').value;
            const budget = parseInt(document.getElementById('budget').value);
            const landArea = parseInt(document.getElementById('land-area').value);

            // Simulate processing delay for UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate recommendations based on inputs
            const data = cropData[soilType];
            const yieldEstimate = Math.round((landArea * 1000) / 10 * (budget / 1000) * (waterSource === 'irrigated' ? 1.2 : 0.8)); // More realistic calculation
            const profitEstimate = Math.round(yieldEstimate * 0.5 * (ph > 5.5 && ph < 7.5 ? 1.1 : 0.9)); // Adjust for pH

            // Build crop suggestions with images
            let cropHtml = '<div class="card"><h3><i class="fas fa-seedling"></i> Best Crops</h3>';
            data.crops.forEach(crop => {
                const imgSrc = cropImages[crop] || '';
                cropHtml += `<p><img src="${imgSrc}" alt="${crop} crop" class="crop-image" loading="lazy"> <strong>${crop}</strong> - Suitable for your soil and climate.</p>`;
            });
            cropHtml += `<p><em>Alternatives:</em> ${data.alternatives.join(', ')} (if primary crops are unavailable).</p></div>`;
            document.getElementById('crop-suggestions').innerHTML = cropHtml;

            document.getElementById('yield-profit').innerHTML = `
                <div class="card">
                    <h3><i class="fas fa-chart-line"></i> Estimated Yield & Profit</h3>
                    <p>Yield: ${yieldEstimate} tons (based on land area, budget, and water source).</p>
                    <p>Profit: ₹${profitEstimate} (after costs; adjust for local market prices).</p>
                </div>
            `;
            document.getElementById('farming-methods').innerHTML = `
                <div class="card">
                    <h3><i class="fas fa-tools"></i> Recommended Farming Methods</h3>
                    <p>${data.methods}</p>
                </div>
            `;
            document.getElementById('crop-rotation').innerHTML = `
                <div class="card">
                    <h3><i class="fas fa-sync-alt"></i> Crop Rotation Advice</h3>
                    <p>${data.rotation}</p>
                </div>
            `;

            // Soil nutrient chart (mock data with tooltips)
            const ctx = document.getElementById('soil-chart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
                    datasets: [{
                        label: 'Nutrient Levels (Estimated)',
                        data: [ph * 10, moisture / 10, temp / 5],
                        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed.y} (Optimal: 50-100)`;
                                }
                            }
                        }
                    }
                }
            });

            // Tools and fertilizers with icons
            document.getElementById('tools-list').innerHTML = `
                <div class="card">
                    <h3><i class="fas fa-wrench"></i> Tools & Fertilizers for ${data.crops[0]}</h3>
                    <p><i class="fas fa-tractor"></i> Tractor and Plow (essential for tilling).</p>
                    <p><i class="fas fa-flask"></i> Organic Fertilizer: Compost or manure (low-cost, eco-friendly).</p>
                    <p><em>Budget Tip:</em> Allocate ₹${Math.round(budget * 0.3)} for tools if needed.</p>
                </div>
            `;

            // Show sections with fade-in
            recommendations.classList.remove('hidden');
            toolsSection.classList.remove('hidden');

        } catch (error) {
            console.error('Error generating recommendations:', error);
            alert('An error occurred. Please check your inputs and try again.');
        } finally {
            submitBtn.disabled = false;
            loadingSpinner.classList.add('hidden');
        }
    });

    // Dark/Light mode toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
    });

    // Placeholder for AI disease detection
    diseaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        diseaseResult.textContent = 'Analysis: No disease detected (placeholder). Upload a clear image for better results.';
    });
});