window.addEventListener("load", Init)

let ex

/* Inventario */
let invBtn
let invInventory
let invNameDD
let invQty
let contentInv
let invDDNameObj
/* VReceta */
let recBtn
let recInventory
let recName
let recIngNameDD
let recPrice
let contentRec
let recDDNameObj
/* Ingredientes */
let ingBtn
let ingInventory
let ingQtyUnit
let contentIng
let ingName
let ingPrice
let ingQty
let ingExcelInstance
let saveBtn
let loadBtn
// Data which will need to add in a file."
let schema =
    [
        {
            column: 'Name',
            type: String,
            value: element => element.op0
        },
        {
            column: 'Date of Birth',
            type: String,
            value: element => element.op1
        },
        {
            column: 'Cost',
            type: String,
            value: element => element.op2
        },
        {
            column: 'Paid',
            type: String,
            value: element => element.op3
        },
        {
            column: 'Buy',
            type: String,
            value: element => element.op4
        }
    ]
let objects =
    [
        {
            name: 'John Smith',
            dateOfBirth: new Date(),
            cost: 1800,
            paid: true,
            paid: true
        },
        {
            name: 'Alice Brown',
            dateOfBirth: new Date(),
            cost: 2600,
            paid: false,
            paid: true
        }
    ]
// Write data in 'newfile.txt' .
let make = []
let make1 = []

let pagExcel
function Init() {

    /*Header: <Elements>*/
    /* Secciones */
    invSection = document.getElementById("inventario")
    addSection = document.getElementById("add")
    recSection = document.getElementById("recetas")
    ingSection = document.getElementById("ingredientes")
    menuSection = document.getElementById("main-menu")
    calSection = document.getElementById("Calculadora")
    expSection = document.getElementById("exportar")


    /* Menu */
    menuNameDD = document.getElementById("menu-name")
    /* Inventario */
    invNameDD = document.getElementById("inv-name")
    invQty = document.getElementById("inv-qty")
    contentInv = document.getElementById("inv-content")
    invId = document.getElementById("inv-id")
    /* Receta */
    recName = document.getElementById("rec-name")
    recIngNameDD = document.getElementById("rec-ing-name")
    recPrice = document.getElementById("rec-price")
    contentRec = document.getElementById("rec-content")
    previewRecIng = document.getElementById("rec-preview")
    /* Ingredientes */
    ingName = document.getElementById("ing-name")
    ingPrice = document.getElementById("ing-price")
    ingQty = document.getElementById("ing-qty")
    ddIngCost = document.getElementById("ing-price-unit")
    contentIng = document.getElementById("ing-content")
    ingQtyUnit = document.getElementById("ing-qty-unit")
    /* Calculadora */
    calNameDD = document.getElementById("cal-name")
    calQty = document.getElementById("cal-qty")
    contentCal = document.getElementById("cal-content")


    /* Butons */
    invBtn = document.getElementById("inv-btn")
    recBtn = document.getElementById("rec-btn")
    recIngBtn = document.getElementById("rec-ing-btn")
    ingBtn = document.getElementById("ing-btn")
    calBtn = document.getElementById("cal-btn")
    saveBtn = document.getElementById("save-btn")
    loadBtn = document.getElementById("load-btn")
    z = document.getElementById("z")

    /* ExcelImport */
    ex = document.getElementById("ex")
    invExcel = document.getElementById("inv-excel")
    recExcel = document.getElementById("rec-excel")
    ingExcel = document.getElementById("ing-excel")

    /* DropDownsValues */
    recDDNameObj = new DropDown(recIngNameDD)
    invDDNameObj = new DropDown(invNameDD)
    calDDNameObj = new DropDown(calNameDD)



    /*Header: <Start>*/

    InitDDMeasure()

    Inventories = []
    for(let i = 0; i < 10;i++)
    {
        Inventories.push(new Inventory("Inventory " + i));
    }
    

    
    
    invInventory = Inventories[0]
    recInventory = new Inventory("Recetas")
    ingInventory = new Inventory("Ingredientes")
    calInventory = new Inventory("Calculo de Ingredientes")

    /*Header: <HardCode>*/

    i = new Ingredient("ingrediente", 0.1, "g", 100, "g")
    i2 = new Ingredient("ingrediente2", 0.5, "oz", 30, "oz")
    ingInventory.AddItem(i)
    ingInventory.AddItem(i2)

    r = new Recipe("receta", 50, "ud", 1, "ud")
    r2 = new Recipe("receta2", 30, "ud", 1, "ud")
    r.AddItem(i.Instance())
    r.AddItem(i.Instance())
    r.AddItem(i.Instance())
    r.AddItem(i2.Instance())
    r2.AddItem(i.Instance())
    r2.AddItem(i.Instance())
    recInventory.AddItem(r.Instance())
    recInventory.AddItem(r2.Instance())

    Update()
    InitDDName()

    /*Header: <Listeners>*/

    invId.addEventListener('change',() =>
    {
        if(invId.value < 0){invId.value = 0}
        if(invId.value >= Inventories.length){invId.value = Inventories.length - 1}
        invInventory = Inventories[invId.value]
        Update()
    })

    ex.addEventListener("change",async function() {
       await ImportExcelIng(ex,3)
       await ImportExcelRec(ex,2)
       await ImportExcelInv(ex,1)
    })

    invExcel.addEventListener('change',() => ImportExcelInv(invExcel,1))
    recExcel.addEventListener('change',() => ImportExcelRec(recExcel,2))
    ingExcel.addEventListener('change',() => ImportExcelIng(ingExcel,3))

    invBtn.addEventListener("click", Inv)
    calBtn.addEventListener("click", Cal)
    recIngBtn.addEventListener("click", RecPreview)
    recBtn.addEventListener("click", Rec)
    ingBtn.addEventListener("click", Ing)
    //saveBtn.addEventListener("click", Save)
    //loadBtn.addEventListener("click", Load)
    z.addEventListener("click", ExportItems)
    recIngNameDD.addEventListener("change", function () {
        ingr2 = ingInventory.GetItem(recIngNameDD.options[recIngNameDD.selectedIndex].text)
        if (ingr2 == null) {
            ingr2 = recInventory.GetItem(recIngNameDD.options[recIngNameDD.selectedIndex].text)
        }
        ingQtyUnit.innerHTML = ingr2.medida
    })
    menuNameDD.addEventListener("change", function () {
        SetDisplays(menuNameDD.options[menuNameDD.selectedIndex].text)
        console.log(menuNameDD.options[menuNameDD.selectedIndex].text);
    })
    SetDisplays("Pagina principal")

    localStorage.setItem("nombre2", "");
    let miNombre = localStorage.getItem("nombre2");
    console.log(miNombre);  
}
function InitDDName() {
    for (let i = 0; i < ingInventory.ingredients.length; i++) {
        recDDNameObj.PushItems([i], [ingInventory.ingredients[i].nombre])
        calDDNameObj.PushItems([i], [ingInventory.ingredients[i].nombre])
    }
    for (let i = 0; i < recInventory.ingredients.length; i++) {
        recDDNameObj.PushItems([i+ ingInventory.ingredients.length], [recInventory.ingredients[i].nombre])
        calDDNameObj.PushItems([i+ ingInventory.ingredients.length], [recInventory.ingredients[i].nombre])
        invDDNameObj.PushItems([i], [recInventory.ingredients[i].nombre])
    }
}
function Update() {
    UpdateInventory()
    UpdateRecipe()
    UpdateIngredients()
    UpdateCalculator()
    InitDDName()
}
function UpdateInventory() {
    contentInv.innerHTML = invInventory.ToString()
}
function UpdateRecipe() {
    contentRec.innerHTML = recInventory.ToString()
}
function UpdateIngredients() {
    contentIng.innerHTML = ingInventory.ToString()
}
function UpdateCalculator() {
    contentCal.innerHTML = calInventory.ToString()
}
async function ReadExcel() {
    const content = await readXlsxFile(ex.files[0])
    pagExcel = new Excel(content)
}
async function ReadExcel(importFile, sheetN = 1) {
    let content = await readXlsxFile(importFile.files[0], { sheet: sheetN })
    return content
}
async function ImportExcelInv(input,sheet = 1)
{
    content = await ReadExcel(input, sheet)
    invExcelInstance = new Excel(content)
    invExcelInstance.Rows().forEach(
        (element) => {
            receta = recInventory.GetItem(element[0]).Instance()
            let recetaing = receta.GetIngredients()
            for (let j = 0; j < element[1]; j++) {
                for (let i = 0; i < recetaing.length; i++) {
                    invInventory.AddItem(recetaing[i].Instance())
                }
            }
            for (let j = 0; j > element[1]; j--) {
                for (let i = 0; i < recetaing.length; i++) {
                    invInventory.SubItem(recetaing[i].Instance())
                }
            }
        }
    )

    Update()
}
async function ImportExcelRec(input,sheet = 1){
    
    content = await ReadExcel(input, sheet)
    recExcelInstance = new Excel(content)
    recExcelInstance.Rows().forEach(
        (element) => {
            receta = new Recipe(element[0], element[1], "ud", 0, "ud")
            txt = element[3].split(",");
            txt2 = element[4].split(",");
            for (let i = 0; i < txt.length; i++) {
                item = ingInventory.GetItem(txt[i])
                item.cantidad = txt2[i]
                receta.AddItem(item.Instance());
            }
            recInventory.AddItem(receta.Instance())
        }
    )

    Update()
}
async function ImportExcelIng(input,sheet = 1){
    content = await ReadExcel(input, sheet)
    ingExcelInstance = new Excel(content)
    ingExcelInstance.Rows().forEach(
        (element) => {
            receta = new Ingredient(element[0], element[1], element[2], 0, element[2])
            ingInventory.AddItem(receta.Instance())
        }
    )

    Update()
}

async function ExportExcelIng(input,sheet = 1){
    content = await writeXlsxFile(input, sheet)
    ingExcelInstance = new Excel(content)
    ingExcelInstance.Rows().forEach(
        (element) => {
            receta = new Ingredient(element[0], element[1], element[2], 0, element[2])
            ingInventory.AddItem(receta.Instance())
        }
    )

    Update()
}
function Inv() {
    if(invNameDD.selectedIndex == -1)return;
    let inputname = invNameDD.options[invNameDD.selectedIndex].text
    console.log(recInventory.GetItem(inputname).Instance().GetIngredients())
    
    receta = recInventory.GetItem(inputname).Instance()
    let recetaing = receta.GetIngredients()
    for (let j = 0; j < invQty.value; j++) {
        for (let i = 0; i < recetaing.length; i++) {
            invInventory.AddItem(recetaing[i].Instance())
            console.log(invNameDD.options[invNameDD.selectedIndex].text)
        }
    }
    for (let j = 0; j > invQty.value; j--) {
        for (let i = 0; i < recetaing.length; i++) {
            invInventory.SubItem(recetaing[i].Instance())
        }
    }
    Update()
}

function Cal() {
    let selected = calNameDD.options[calNameDD.selectedIndex].text
    
    if(!PushRecipe(selected)){PushIngredient(selected)}
  
    Update()
}

function PushRecipe(_selected)
{
    let selected = recInventory.GetItem(_selected)
    if(selected != null){receta = selected.Instance()}
    else{return false;}
    let recetacal = receta.GetIngredients()
    for (let j = 0; j < calQty.value; j++) {
        for (let i = 0; i < recetacal.length; i++) {
            calInventory.AddItem(recetacal[i].Instance())
        }
    }
    for (let j = 0; j > calQty.value; j--) {
        for (let i = 0; i < recetacal.length; i++) {
            calInventory.SubItem(recetacal[i].Instance())
        }
    }
    return true;
}
function PushIngredient(_selected)
{
    let selected = ingInventory.GetItem(_selected)
    if(selected != null){receta = selected.Instance()}
    else{return false;}
    let recetacal = receta.GetIngredients()
    for (let j = 0; j < calQty.value; j++) {
        
        calInventory.AddItem(recetacal.Instance())
        
    }
    for (let j = 0; j > calQty.value; j--) {
        calInventory.SubItem(recetacal.Instance())
    }
    return true;
}

let isMakingRecipe = false;
let recipePreview;


function RecPreview() {
    if(!isMakingRecipe)
    {
        recipePreview = new Recipe(recName.value, recPrice.value, "ud", 0, ingQtyUnit.value)
        isMakingRecipe = true;
    }
    ingr = ingInventory.GetItem(recIngNameDD.options[recIngNameDD.selectedIndex].text)
    if (ingr == null) {
        ingr = recInventory.GetItem(recIngNameDD.options[recIngNameDD.selectedIndex].text)
    }
    ingr = ingr.Instance()
    ingr.cantidad = ingQty.value
    ingr.medida = ingr.xmedida
    recipePreview.AddItem(ingr)
    previewRecIng.innerHTML = recipePreview.ToString()
}
function Rec() {
    isMakingRecipe = false;
    recInventory.AddItem(recipePreview.Instance())
    Update()
}
function Ing() {
    receta = new Ingredient(ingName.value, ingPrice.value, ddIngCost.value, 0, ddIngCost.value)
    ingInventory.AddItem(receta.Instance())
    Update()
    InitDDName()
}
function Save() {
    localStorage.setItem("Inventory", Inventories);
}
function Load() {
    let inbox = localStorage.getItem("Inventory");
    if( inbox != null)
    {
        Inventories = inbox;
    }
    invInventory = Inventories[invId.value]
        Update()
}
async function ExportItems() {
    schema = pagExcel.GetSchema(pagExcel.Header())
    objects = pagExcel.GetObjectGroup(pagExcel.Rows())
    const content = await writeXlsxFile
        (objects,
            {
                schema,
                fileName: 'file.xlsx'
            }
        )
}

async function ExportItems2() {
    schema = invInventory.ToExcel().GetSchema(invInventory.ToExcel().Header())
    objects = invInventory.ToExcel().GetObjectGroup(invInventory.ToExcel().Rows())
    const content = await writeXlsxFile
        (objects,
            {
                schema,
                fileName: 'file.xlsx'
            }
        )
}

function AddValueToAll(Inventory, Recipelist = []) {
    for (let i = 0; i < this.Recipelist.length; i++) {
        if (Recipelist[i] instanceof Recipe) {

        }
        Inventory.AddValue(Recipelist[i].AddValue())
    }

}


function InitDDMeasure() {
    DDM = new DropDown(ddIngCost)
    DDM.PushItems1D([
        "ud", "unidades",
        "mg", "miligramos",
        "g", "gramos",
        "kg", "kilogramos",
        "ml", "mililitros",
        "lt", "litros",
        "oz", "onzas",
        "gal", "galones",
        "cu", "cucharadas",
        'Libras','Libras',
        'Kilogramos','Kilogramos',
        'Onzas','Onzas',
        'Piedras','Piedras',
        'Libras de Troy','Libras de Troy',
        'Onzas de Troy','Onzas de Troy',
        'Gramos','Gramos',
        'Miligramos','Miligramos',
        'Microgramos','Microgramos',
        'Quilates','Quilates',
        'Quintales cortos','Quintales cortos',
        'Quintales largos','Quintales largos'
        
    ])
}

function SetDisplays(selection)
{
    switch(selection)
    {
        case "Pagina principal":
            DisplayHide(invSection)
            DisplayHide(addSection)
            DisplayHide(recSection)
            DisplayHide(ingSection)
            DisplayHide(calSection)
            DisplayHide(expSection)
            DisplayShow(menuSection)
            
            break;
        case "Ver inventario":
            DisplayShow(invSection)
            DisplayHide(addSection)
            DisplayHide(recSection)
            DisplayHide(ingSection)
            DisplayHide(calSection)
            DisplayHide(expSection)
            DisplayShow(menuSection)
        break;
        case "Aplicar Ventas":
            DisplayShow(invSection)
            DisplayShow(addSection)
            DisplayHide(recSection)
            DisplayHide(ingSection)
            DisplayHide(calSection)
            DisplayHide(expSection)
            DisplayShow(menuSection)
        break;
        case "Aplicar Compras":
            DisplayShow(invSection)
            DisplayShow(addSection)
            DisplayHide(recSection)
            DisplayHide(ingSection)
            DisplayHide(calSection)
            DisplayHide(expSection)
            DisplayShow(menuSection)
        break;
        case "Ingredientes y recetas":
            DisplayHide(invSection)
            DisplayHide(addSection)
            DisplayShow(recSection)
            DisplayShow(ingSection)
            DisplayHide(calSection)
            DisplayHide(expSection)
            DisplayShow(menuSection)
        break;
        case "Calculadora":
            DisplayHide(invSection)
            DisplayHide(addSection)
            DisplayHide(recSection)
            DisplayHide(ingSection)
            DisplayShow(calSection)
            DisplayShow(menuSection)
            DisplayHide(expSection)
        break;
        default:
            DisplayHide(invSection)
            DisplayHide(addSection)
            DisplayHide(recSection)
            DisplayHide(ingSection)
            DisplayHide(calSection)
            DisplayHide(expSection)
            DisplayHide(menuSection)
            break;
    }
}

function DisplayHide(section)
{
    section.style.display = "none"
}
function DisplayShow(section)
{
    section.style.display = "block"
}
