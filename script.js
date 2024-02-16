let x = 50;
let y = 50;

function setRandomTrees() {
    var nbTrees = Math.floor(Math.random() * 25) + 1;
    let forest = document.getElementById('zone-foret');
    for (var i = 0; i < nbTrees; i++) {
        let tree = document.createElement('div');
        tree.classList.add('arbre');
        tree.style.left = Math.floor(Math.random() * 100) + '%';
        tree.style.top = Math.floor(Math.random() * 100) + '%';
        forest.appendChild(tree);
        localStorage.setItem('tree' + i, 10);
    }
}

function moveCharacter(event) {
    let character = document.getElementById('personnage');
    switch (event.key) {
        case 'z':
            y -= 1;
            break;
        case 's':
            y += 1;
            break;
        case 'q':
            x -= 0.5;
            break;
        case 'd':
            x += 0.5;
            break;
        case 'e':
            document.getElementById('popup-craft').style.display = 'flex';
            break;
        case ' ':
            mineBlocks();
            break;
        case 'a':
            setBlocks();
            break;
    }
    character.style.left = x + '%';
    character.style.top = y + '%';
    updateCoordonates();
}

function updateCoordonates() {
    document.getElementById('coordonnees').innerHTML = `x: ${x} y: ${y}`;
}

function closeCraft() {
    document.getElementById('popup-craft').style.display = 'none';
}

function mineBlocks() {
    if (x > 0 && x < 69 && y > 0 && y < 69) {
            addInventory('grass');
        }
    else if (x > 69 && x < 84 && y > 0 && y < 100) {
        addInventory('sand');
    }
    else if (x > 0 && x < 69 && y > 69 && y < 100) {
        addInventory('log');
    }
}

function addInventory(item) {
    for (let i = 1; i <= 5; i++) {
        let nbSlot = localStorage.getItem('nbslot' + i);
        if ((localStorage.getItem('slot' + i) === item) && (localStorage.getItem('nbslot' + i) <= 69)) {
            localStorage.setItem('nbslot' + i, parseInt(nbSlot) + 1);
            return;
        }
    }
    for (let i = 1; i <= 5; i++) {
        let slot = localStorage.getItem('slot' + i);
        let nbSlot = localStorage.getItem('nbslot' + i);
        if ((slot === item || slot === '') && nbSlot < 69) {
            localStorage.setItem('slot' + i, item);
            localStorage.setItem('nbslot' + i, parseInt(nbSlot) + 1);
            let slotElements = document.getElementsByClassName('slot' + i);
            slotElements[0].innerHTML = slotElements[1].innerHTML = `<img src="${item}.png" alt="item"/>`;
            return;
        }
    }
    window.alert('Inventaire plein');
}

function removeInventory(slot) {
    let nbSlot = localStorage.getItem('nbslot' + slot);
    if (nbSlot > 0) {
        localStorage.setItem('nbslot' + slot, nbSlot - 1);
        if (nbSlot - 1 === 0) {
            localStorage.setItem('slot' + slot, '');
            let slotElements = document.getElementsByClassName('slot' + slot);
            slotElements[0].innerHTML = slotElements[1].innerHTML = '';
        }
    }
}

function setBlocks() {
    if (document.getElementById('DrawColorChoice').style.display === 'flex') {
        let block = document.createElement('div');
        block.classList.add('block');
        block.style.left = x + '%';
        block.style.top = y + '%';
        block.style.backgroundColor = localStorage.getItem('color');
        document.getElementById('zone-herbe').appendChild(block);
    }
    else {
        let slot = localStorage.getItem('selected');
        let slotItem = localStorage.getItem('slot' + slot);
        if (slotItem === '') {
            return;
        }
        if (x > 0 && x < 69 && y > 0 && y < 69) {
            let block = document.createElement('div');
            block.classList.add('block');
            block.style.left = x + '%';
            block.style.top = y + '%';
            if (slotItem === 'grass') {
                block.style.backgroundColor = '#287a0f';
            } else if (slotItem === 'sand') {
                block.style.backgroundColor = '#f7e6b7';
            } else if (slotItem === 'log') {
                block.style.backgroundColor = '#69502a';
            } else if (slotItem === 'plank') {
                block.style.backgroundColor = '#b99767';
            } else if (slotItem === 'button') {
                block.style.backgroundColor = '#b99767';
                block.style.width = '10px';
                block.style.height = '5px';
            }
            document.getElementById('zone-herbe').appendChild(block);
            removeInventory(slot);
        }
    }
}

function select(slot) {
    let oldSlot = localStorage.getItem('selected');
    let oldSelectedSlot = document.getElementsByClassName('slot' + oldSlot);
    oldSelectedSlot[0].style.border = '#757369 5px solid';
    oldSelectedSlot[1].style.border = '#757369 5px solid';
    localStorage.setItem('selected', slot);
    let selectedSlot = document.getElementsByClassName('slot' + slot);
    selectedSlot[0].style.border = '5px solid red';
    selectedSlot[1].style.border = '5px solid red';
}

function setInCraftTable(craftSlot) {
    let slot = localStorage.getItem('selected');
    let slotItem = localStorage.getItem('slot' + slot);
    let craftslot = document.getElementsByClassName('craftSlot' + craftSlot);
    let craftSlotItem = localStorage.getItem('craftSlot' + craftSlot);
    if (craftslot[0].innerHTML === '' && slotItem !== '' && craftSlotItem === '') {
        craftslot[0].innerHTML = `<img src="${slotItem}.png" alt="item"/>`;
        localStorage.setItem('craftSlot' + craftSlot, slotItem);
        removeInventory(slot);
    }
    else if (craftSlotItem !== ''){
        addInventory(craftSlotItem);
        craftslot[0].innerHTML = '';
        localStorage.setItem('craftSlot' + craftSlot, '');
    }
    verifyCraft();
}

function verifyCraft() {
    let craftSlots = Array.from({length: 9}, (_, i) => localStorage.getItem('craftSlot' + (i + 1)));

    if (craftSlots.filter(slot => slot === 'log').length === 1) {
        document.getElementById('resultat-craft').innerHTML = '<img src="plank.png" alt="item"/>';
        localStorage.setItem('resultat', 'plank');
    }
    else if (craftSlots.filter(slot => slot === 'plank').length === 1) {
        document.getElementById('resultat-craft').innerHTML = '<img src="button.png" alt="item"/>';
        localStorage.setItem('resultat', 'button');
    }
    else {
        document.getElementById('resultat-craft').innerHTML = '';
        localStorage.setItem('resultat', '');
    }
}

function getResult() {
    if (localStorage.getItem('resultat') !== '') {
        addInventory(localStorage.getItem('resultat'));
        for (let i = 1; i <= 9; i++) {
            let craftslot = document.getElementsByClassName('craftSlot' + i);
            localStorage.setItem('resultat', '');
            document.getElementById('resultat-craft').innerHTML = '';
            craftslot[0].innerHTML = '';
            localStorage.setItem('craftSlot' + i, '');
        }
    }
}

function colors() {
    if (document.getElementById('DrawColorChoice').style.display === 'flex') {
        document.getElementById('DrawColorChoice').style.display = 'none';
    }
    else {
        document.getElementById('DrawColorChoice').style.display = 'flex';
    }
}

function setColor(color) {
    localStorage.setItem('color', color);
}

function jeu() {
    for (let i = 1; i <= 5; i++) {
        localStorage.setItem(`slot${i}`, '');
        localStorage.setItem(`nbslot${i}`, 0);
    }
    for (let i = 1; i <= 9; i++) {
        localStorage.setItem(`craftSlot${i}`, '');
        document.getElementsByClassName('craftSlot' + i)[0].innerHTML = '';
    }
    localStorage.setItem('selected', 1);
    select(1);
    setRandomTrees();
    updateCoordonates();
    document.addEventListener('keydown', moveCharacter);
}