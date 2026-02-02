/**
 * 配置数据表 (Manifest)
 * 包含 前端 UI显示用信息 & 给 AI 插入的 unlock keys
 */
const GenesisData = [
    { 
        id: 1, name: 'Kanto', code: 'gen1', range: 'Lv. Cap Broken', 
        starters: [ 'bulbasaur', 'charmander', 'squirtle' ],
        mechanics: ['enable_proficiency_cap'], 
        desc: 'Special: Proficiency / Level Break' 
    },
    { 
        id: 2, name: 'Johto', code: 'gen2', range: 'Apricorns', 
        starters: [ 'chikorita', 'cyndaquil', 'totodile' ],
        mechanics: ['enable_proficiency_cap'], 
        desc: 'Special: Apricorn Ball Mechanics' 
    },
    { 
        id: 3, name: 'Hoenn', code: 'gen3', range: 'Clash', 
        starters: [ 'treecko', 'torchic', 'mudkip' ],
        mechanics: ['enable_clash', 'enable_environment'], 
        desc: 'Special: Move Clash / Weather' 
    },
    { 
        id: 4, name: 'Sinnoh', code: 'gen4', range: 'Standard', 
        starters: [ 'turtwig', 'chimchar', 'piplup' ],
        mechanics: [], 
        desc: 'Classic Battle Systems' 
    },
    { 
        id: 5, name: 'Unova', code: 'gen5', range: 'Standard', 
        starters: [ 'snivy', 'tepig', 'oshawott' ],
        mechanics: ['enable_environment'], 
        desc: 'Triple Battle Logic / Weather' 
    },
    { 
        id: 6, name: 'Kalos', code: 'gen6', range: 'Mega Evo', 
        starters: [ 'chespin', 'fennekin', 'froakie' ],
        mechanics: ['enable_mega'], 
        desc: 'Mechanic: Mega Evolution Unlocked' 
    },
    { 
        id: 7, name: 'Alola', code: 'gen7', range: 'Z-Move', 
        starters: [ 'rowlet', 'litten', 'popplio' ],
        mechanics: ['enable_z_move'], 
        desc: 'Mechanic: Z-Power / Ride Pkm' 
    },
    { 
        id: 8, name: 'Galar', code: 'gen8', range: 'Dynamax', 
        starters: [ 'grookey', 'scorbunny', 'sobble' ],
        mechanics: ['enable_dynamax'], 
        desc: 'Mechanic: Dynamax Spots' 
    },
    { 
        id: 0, name: 'Hisui', code: 'pla', range: 'Styles', 
        starters: [ 'rowlet', 'cyndaquil', 'oshawott' ],
        mechanics: ['enable_styles', 'enable_clash'],
        formSuffix: '-hisui', // 用于最终数据标记
        desc: 'Specific: Agile / Strong Style Arts' 
    },
    { 
        id: 9, name: 'Paldea', code: 'gen9', range: 'Terastal', 
        starters: [ 'sprigatito', 'fuecoco', 'quaxly' ],
        mechanics: ['enable_tera'], 
        desc: 'Mechanic: Tera Type Shell' 
    },
    { 
        id: 99, name: 'CUSTOM', code: 'custom', range: 'Any / Sandbox',
        starters: [],
        userDefine: true,
        mechanics: [],
        desc: 'Build Your Own World Configuration'
    }
];

// 全局状态
const State = {
    selectedGenIndex: -1,
    selectedStarter: null, // string 'charmander' etc.
    animeMode: true
};

const UI = {
    genList: document.getElementById('gen-list'),
    detailArea: document.getElementById('detail-area'),
    regionName: document.getElementById('region-name'),
    featureList: document.getElementById('feature-list'),
    renderZone: document.getElementById('render-zone')
};

// 辅助：获取图片 (与 Universal 版一致的逻辑)
function getSprite(name) {
    if(!name) return; 
    // 使用 PokemonDB 作为稳定源
    return `https://img.pokemondb.net/sprites/scarlet-violet/normal/${name}.png`;
}

function getSvgIcon(code) {
    const svgs = {
        'mega': '<svg viewBox="0 0 14 17.5" fill="currentColor"><g><path d="M3.88792,10.9 C5.96264,10.9,8.03736,10.9,10.1121,10.9 C11.0183,10.9426,11.0183,9.45744,10.1121,9.5 C8.03736,9.5,5.96264,9.5,3.88792,9.5 C2.98166,9.45744,2.98166,10.9426,3.88792,10.9 z"/><path d="M2.75289,2 C2.75289,2.10488,2.75289,2.20976,2.75289,2.31464 C2.75355,4.80881,4.40963,6.99632,6.81004,7.67374 C8.60567,8.17928,9.84777,9.81993,9.84711,11.6854 C9.84711,11.7903,9.84711,11.8951,9.84711,12 C9.80455,12.9063,11.2897,12.9063,11.2471,12 C11.2471,11.8951,11.2471,11.7903,11.2471,11.6854 C11.2464,9.19119,9.59033,7.00368,7.18992,6.32626 C5.39429,5.82072,4.15223,4.18007,4.15289,2.31464 C4.15289,2.20976,4.15289,2.10488,4.15289,2 C4.19545,1.09374,2.71033,1.09374,2.75289,2 z"/><g><path d="M6.99988,6.26793 C6.93733,6.28879,6.87403,6.30825,6.81004,6.32626 C4.40962,7.00368,2.75355,9.1912,2.75289,11.6854 C2.75289,11.6854,2.75289,12,2.75289,12 C2.71033,12.9063,4.19545,12.9063,4.15289,12 C4.15289,12,4.15289,11.6854,4.15289,11.6854 C4.15223,9.81992,5.3943,8.17928,7.18992,7.67374 C7.73053,7.52117,8.23338,7.29202,8.68807,7.00001 C8.23346,6.70808,7.73068,6.47894,7.19012,6.32632 C7.12599,6.30829,7.06257,6.28881,6.99988,6.26793 z"/><path d="M8.21185,5.62527 C9.21994,4.85339,9.84758,3.64081,9.84711,2.31464 C9.84711,2.31464,9.84711,2,9.84711,2 C9.80455,1.09375,11.2897,1.09374,11.2471,2 C11.2471,2,11.2471,2.31464,11.2471,2.31464 C11.2467,3.88075,10.5936,5.32595,9.51336,6.35232 C9.1132,6.06454,8.67745,5.81966,8.21185,5.62527 z"/></g><g><path d="M6.02737,4.5 C6.02737,4.5,10.1121,4.5,10.1121,4.5 C11.0183,4.54256,11.0183,3.05744,10.1121,3.1 C10.1121,3.1,5.2513,3.1,5.2513,3.1 C5.38672,3.62909,5.65656,4.11049,6.02737,4.5 z"/></g></g></svg>',
        'z': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.25 2L4 13h6l-2 9 9.5-12H10l3-8z"/></svg>',
        'dmax': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5l6.5 13h-13L12 5.5zM12 8l-2 4h4l-2-4z"/></svg>',
        'tera': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-9.5 5.5v9L12 22l9.5-5.5v-9L12 2zM12 19.5L5.5 15.8v-7.6L12 4.5l6.5 3.7v7.6L12 19.5z"/><path d="M12 7.5L8 10l4 2.5 4-2.5-4-2.5z"/></svg>',
        'bond': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
        'style': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 93.75" fill="currentColor"><path transform="scale(.75)" d="m50 5.8594c-11.79 0-22.876 4.5903-31.213 12.928-8.3374 8.3366-12.928 19.422-12.928 31.213s4.5903 22.874 12.928 31.211c2.8053 2.8061 5.9253 5.1857 9.2754 7.1113-2.8564-4.2252-4.5273-9.3145-4.5273-14.787 0-14.593 11.872-26.465 26.465-26.465 11.362 0 20.605-9.2438 20.605-20.605s-9.2438-20.605-20.605-20.605zm21.939 5.8184c2.8572 4.2252 4.5254 9.3146 4.5254 14.787 0 14.593-11.872 26.465-26.465 26.465-11.362 0-20.605 9.2438-20.605 20.605s9.2438 20.605 20.605 20.605c11.79 0 22.876-4.5923 31.213-12.93 8.3374-8.3367 12.928-19.42 12.928-31.211s-4.5903-22.876-12.928-31.213c-2.8053-2.8061-5.9234-5.1837-9.2734-7.1094zm-21.939 3.0625c6.4652 0 11.725 5.2602 11.725 11.725 0 6.4644-5.2595 11.723-11.725 11.723-6.4652 0-11.725-5.2575-11.725-11.723-2e-6 -6.4651 5.2595-11.725 11.725-11.725zm0 5.8594c-3.2341 0-5.8652 2.6311-5.8652 5.8652-2e-6 3.2341 2.6311 5.8633 5.8652 5.8633 3.2341 0 5.8652-2.6292 5.8652-5.8633 0-3.2341-2.6311-5.8652-5.8652-5.8652zm0 41.211c6.4652 0 11.725 5.2594 11.725 11.725s-5.2595 11.723-11.725 11.723c-6.4652 0-11.725-5.2575-11.725-11.723-2e-6 -6.4652 5.2595-11.725 11.725-11.725zm0 5.8594c-3.2341 0-5.8652 2.6311-5.8652 5.8652s2.6311 5.8633 5.8652 5.8633c3.2341-1e-6 5.8652-2.6292 5.8652-5.8633s-2.6311-5.8652-5.8652-5.8652z" stroke-width=".19531"/></svg>',
        'eye': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>',
        'cap': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>'
    };
    return svgs[code] || '';
}

/* === 八大机制定义 === */
const MECHANICS_DICT = [
    { key: 'enable_mega', label: 'Mega Evolution', desc: 'Gen 6 Systems', icon: 'mega' },
    { key: 'enable_z_move', label: 'Z-Moves Force', desc: 'Gen 7 Systems', icon: 'z' },
    { key: 'enable_dynamax', label: 'Dynamax Spots', desc: 'Gen 8 Systems', icon: 'dmax' },
    { key: 'enable_tera', label: 'Terastallized', desc: 'Gen 9 Systems', icon: 'tera' },
    { key: 'enable_bond', label: 'Bond / Anime', desc: 'Sync Bonding', icon: 'bond' },
    { key: 'enable_styles', label: 'Agile/Strong', desc: 'PLA Mechanics', icon: 'style' },
    { key: 'enable_insight', label: 'Insight Eye', desc: 'Status View', icon: 'eye' },
    { key: 'enable_proficiency_cap', label: 'Level Break', desc: 'Over Level', icon: 'cap' }
];

/**
 * 逻辑控制器
 */
const Launcher = {
    init() {
        GenesisData.forEach((gen, idx) => {
            const card = document.createElement('div');
            card.className = 'gen-card';
            if (gen.id === 0) card.style.borderBottom = '4px solid #fab1a0';
            if (gen.id === 99) card.style.borderBottom = '4px solid #6c5ce7';
            card.innerHTML = `
                <div class="gc-inner">
                    <div class="gc-num">${gen.id === 99 ? '?' : (gen.id === 0 ? 'H' : gen.id)}</div>
                    <div class="gc-name">${gen.name}</div>
                    <div class="gc-bonus">${gen.range}</div>
                </div>
            `;
            card.onclick = () => Launcher.selectGen(idx, card);
            UI.genList.appendChild(card);
        });
    },

    selectGen(index, cardEl) {
        document.querySelectorAll('.gen-card').forEach(c => c.classList.remove('active'));
        cardEl.classList.add('active');

        State.selectedGenIndex = index;
        State.selectedStarter = null;

        const screenEl = document.getElementById('screen-display');
        const data = GenesisData[index];
        const renderZone = document.getElementById('render-zone');

        if (screenEl) {
            const tagLabel = document.querySelector('.sim-header .section-tag');
            screenEl.className = 'sim-screen';

            const currentId = data.id;
            if (currentId === 1) {
                screenEl.classList.add('theme-gen1');
                if (tagLabel) tagLabel.innerText = 'AREA MAP';
            } else if (currentId === 2) {
                screenEl.classList.add('theme-gen2');
                if (tagLabel) tagLabel.innerText = 'POKÉGEAR';
            } else if (currentId === 3) {
                screenEl.classList.add('theme-gen3');
                if (tagLabel) tagLabel.innerText = 'BATTLE SCENE';
            } else if (currentId === 4) {
                screenEl.classList.add('theme-gen4');
                if (tagLabel) tagLabel.innerText = 'COMMAND?';
            } else if (currentId === 5) {
                screenEl.classList.add('theme-gen5');
                if (tagLabel) tagLabel.innerText = 'LINK STATUS_';
            } else if (currentId === 6) {
                screenEl.classList.add('theme-gen6');
                if (tagLabel) tagLabel.innerText = 'KEY STONE_';
            } else if (currentId === 7) {
                screenEl.classList.add('theme-gen7');
                if (tagLabel) tagLabel.innerText = 'Z-POWER_';
            } else if (currentId === 8) {
                screenEl.classList.add('theme-gen8');
                if (tagLabel) tagLabel.innerText = 'CHALLENGERS';
            } else if (currentId === 9) {
                screenEl.classList.add('theme-gen9');
                if (tagLabel) tagLabel.innerText = 'TERA CHARGE_';
            } else if (currentId === 0) {
                screenEl.classList.add('theme-hisui');
                if (tagLabel) tagLabel.innerText = '神奧尊';
            } else {
                if (tagLabel) tagLabel.innerText = 'SYSTEM_TARGET';
            }
        }

        UI.detailArea.style.display = 'block';
        UI.detailArea.classList.remove('anim-fade');
        void UI.detailArea.offsetWidth;
        UI.detailArea.classList.add('anim-fade');

        UI.regionName.innerText = data.name.toUpperCase();
        UI.featureList.innerText = data.desc.toUpperCase();

        const badgeContainer = document.getElementById('region-badges');
        if (badgeContainer) badgeContainer.innerHTML = '';

        const isCustom = data.id === 99;

        if (!isCustom && badgeContainer && data.mechanics?.length) {
            data.mechanics.forEach(mechKey => {
                const meta = MECHANICS_DICT.find(m => m.key === mechKey);
                if (meta?.icon) {
                    const div = document.createElement('div');
                    div.className = 'mb-icon';
                    div.style.background = 'transparent';
                    div.style.border = 'none';
                    div.style.width = '24px';
                    div.style.height = '24px';
                    div.style.color = '#333';
                    div.title = `${meta.label} Active`;
                    div.innerHTML = getSvgIcon(meta.icon);
                    badgeContainer.appendChild(div);
                }
            });
        }

        if (!renderZone) return;

        if (isCustom) {
            this.renderCustomUI();
            return;
        }

        const startersBlock = data.starters.map(pkmName => {
            const title = pkmName.charAt(0).toUpperCase() + pkmName.slice(1);
            return `
                <div class="starter-btn" onclick="Launcher.setStandardStarter(this, '${pkmName}')">
                    <img src="${getSprite(pkmName)}" class="pk-img" loading="lazy">
                    <span class="pk-name">${title}</span>
                </div>
            `;
        }).join('');

        const htmlBlock = `
            <span class="section-tag">DETECTED SIGNALS</span>
            <div class="starter-grid">
                ${startersBlock}
            </div>

            <div style="height:20px;"></div>

            <div class="config-block" id="anime-options" style="box-shadow:none; border:1px solid #4a4a4a; background:rgba(0,0,0,0.8);">
                <div class="conf-text" style="transform: skewX(0);">
                    <div class="ct-main" style="color:#00cec9; font-size:1rem;">ANIME_MODE.sys</div>
                    <div class="ct-sub">Bond Logic / Plot Armor / Voice</div>
                </div>
                <div class="ch-box-wrap" style="transform: skewX(0);">
                    <label>
                        <input type="checkbox" id="anime-toggle" class="native-check" ${State.animeMode ? 'checked' : ''}>
                        <div class="custom-check" style="height:20px; width:40px;"></div>
                    </label>
                </div>
            </div>
        `;

        renderZone.innerHTML = htmlBlock;

        const toggle = document.getElementById('anime-toggle');
        if (toggle) toggle.onchange = (e) => { State.animeMode = e.target.checked; };
    },

    renderCustomUI() {
        const container = document.getElementById('render-zone');
        if (!container) return;

        const mechCards = MECHANICS_DICT.map(m => `
            <div class="switch-card" data-key="${m.key}">
                <div class="sc-icon">${getSvgIcon(m.icon)}</div>
                <div class="sc-info" style="flex:1">
                    <div class="sc-label" style="font-weight:900;">${m.label}</div>
                    <div class="sc-label" style="font-size:0.6rem; opacity:0.6;">${m.desc}</div>
                </div>
                <div class="sc-box-wrap">
                    <div class="sc-box"></div>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="custom-panel-frame">
                <h3 class="custom-panel-title">Custom Parameters</h3>

                <div class="cust-input-group">
                    <div class="hero-lbl">Designation // 目标地区名</div>
                    <input type="text" id="cust-region" class="hero-input" placeholder="Enter Region Name..." value="Unknown Region">
                </div>

                <div class="cust-input-group">
                    <div class="hero-lbl">Soul Link // 初始搭档 ID (English)</div>
                    <div class="poke-id-row">
                        <input type="text" id="cust-starter" class="hero-input input-poke" placeholder="e.g. mudkip" oninput="Launcher.previewCustomSprite(this)">
                        <div id="cust-preview" class="img-preview-box">
                            <span style="font-size:0.6rem; color:#b2bec3;">IMG</span>
                        </div>
                    </div>
                </div>
            </div>

            <span class="section-tag" style="margin-top:10px;">SYSTEM KERNEL // 系统内核覆写</span>
            <div class="mech-grid">
                ${mechCards}
            </div>

            <div style="height:20px"></div>
        `;

        UI.regionName.innerText = 'CUSTOM SANDBOX';
        UI.featureList.innerText = 'MANUAL CONFIGURATION';

        container.querySelectorAll('.switch-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('active');
            });
        });
    },

    setStandardStarter(btn, name) {
        document.querySelectorAll('.starter-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        State.selectedStarter = name;
    },

    previewCustomSprite(inputEl) {
        const val = (inputEl.value || '').trim().toLowerCase();
        State.selectedStarter = val;
        const prev = document.getElementById('cust-preview');
        if (!prev) return;

        if (val.length > 2) {
            const imgUrl = getSprite(val);
            prev.innerHTML = `<img src="${imgUrl}" onerror="this.style.display='none'">`;
            prev.classList.add('has-img');
        } else {
            prev.innerHTML = '<span style="font-size:0.6rem; color:#b2bec3;">HOLO</span>';
            prev.classList.remove('has-img');
        }
    },

    createWorld() {
        const idx = State.selectedGenIndex;
        if (idx === -1) return alert('请选择一个 Option！');

        const data = GenesisData[idx];
        const isCustom = data.id === 99;
        let finalRegion = data.name;
        let finalStarter = State.selectedStarter;
        let finalMechanics = {};
        const finalSettings = { enableSFX: true, enableBGM: true };

        if (!isCustom) {
            if (!finalStarter) return alert('请选择初始宝可梦！');
            data.mechanics.forEach(key => finalMechanics[key] = true);
            if (State.animeMode) {
                finalMechanics['enable_bond'] = true;
                finalMechanics['enable_av_logic'] = true;
                finalMechanics['enable_aim_bot'] = true;
            }
            finalSettings.animeMode = State.animeMode;
        } else {
            const regInput = document.getElementById('cust-region');
            const startInput = document.getElementById('cust-starter');
            const toggleCards = document.querySelectorAll('.mech-grid .switch-card');

            if (!startInput || !startInput.value.trim()) return alert('请输入自定义宝可梦的名字 (英文ID)！');

            finalRegion = regInput && regInput.value ? regInput.value.trim() : 'Unknown Region';
            finalStarter = startInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

            toggleCards.forEach((card, i) => {
                if (card.classList.contains('active')) {
                    const key = MECHANICS_DICT[i].key;
                    finalMechanics[key] = true;
                }
            });

            if (finalMechanics['enable_bond']) {
                finalMechanics['enable_av_logic'] = true;
                finalSettings.animeMode = true;
            } else {
                finalSettings.animeMode = false;
            }
        }

        const newDB = {
            version: 'Ver.Dawn-V1.1-CustomBuild',
            player: {
                name: 'Trainer',
                money: 3000,
                party: {
                    slot1: {
                        name: finalStarter,
                        species: finalStarter,
                        lv: 5, gender: 'M', nature: 'Hardy', ability: 'hidden', item: null,
                        mood: 'happy',
                        friendship: { avs: { trust: 60, passion: 30, insight: 10, devotion: 0 } },
                        moves: { move1: 'Tackle', move2: 'Leer' },
                        isLead: true
                    },
                    slot2: {}, slot3: {}, slot4: {}, slot5: {}, slot6: {}
                },
                box: {},
                unlocks: finalMechanics,
                world_state: {
                    region: finalRegion,
                    location: 'Starting Point'
                },
                settings: finalSettings
            }
        };

        const jsonStr = JSON.stringify(newDB, null, 2);
        console.log('Generated:', newDB);

        const logicType = isCustom ? 'CUSTOM SANDBOX' : (finalSettings.animeMode ? 'ANIME LOGIC' : 'GAME LOGIC');
        const msg = `
[SYSTEM: WORLD RESET]
// Mode: ${logicType}
// Region: ${finalRegion}
// Starter: ${finalStarter.toUpperCase()}
// Unlocks: ${Object.keys(finalMechanics).length} Modules Active

<VariableInsert>
${jsonStr}
</VariableInsert>

[引导]
${isCustom ? `这里是自建世界区域${finalRegion}。请描述主角获得了${finalStarter}的场景。注意启用的特殊系统: ${Object.keys(finalMechanics).join(', ')}。` : '请沿用官方开局剧本。'}`.trim();

        copyToClipboard(msg);
    }
};

function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('初始数据已生成并复制！(模拟发送给AI)');
}

// 启动
window.onload = Launcher.init;
