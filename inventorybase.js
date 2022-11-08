class Ingredient {
    constructor(nombre, costo, xmedida, cantidad, medida, marca = "") {
        const conv = new Conversion()
        this.nombre = nombre
        this.costo = costo
        this.xmedida = xmedida
        this.cantidad = cantidad
        this.medida = xmedida
        this.marca = marca
    }

    ToString() {
        return (this.nombre + " Price:" + this.costo + "$x " + this.xmedida + " Qty:" + this.cantidad + " " + this.medida)
    }
    ToTable() {
        return [his.nombre, this.costo, this.xmedida, this.cantidad, this.medida];
    }
    ToOBJ(mysucursal = "Default") {
        return {nombre : his.nombre,costo: this.costo,unidad: this.xmedida,cantidad: this.cantidad, Sucursal : mysucursal};
    }
    Instance(instance = null) {
        instance = new Ingredient(this.nombre, this.costo, this.xmedida, this.cantidad, this.medida, this.marca)
        return instance
    }
    GetIngredients() {
        return this
    }
    GetItem(name) {
        if (this.nombre === name) {
            return this
        }
        return null
    }
}
class Recipe extends Ingredient {
    constructor(nombre, costo, xmedida, cantidad, medida, servicios = 1) {
        super(nombre, costo, xmedida, cantidad, medida)
        this.ingredients = []
        this.servings = servicios;
        this.counter = this.servings;
    }

    ToString(txt = "") {
        this.ingredients.forEach(element => {
            txt += "(" + element.ToString() + ")"
        });
        return (this.nombre + " Price:" + this.costo + "$x " + this.xmedida + " Qty:{" + this.cantidad + " " + this.medida + "} Ingredients:[" + txt + "]")
    }
    ToOBJ(mysucursal = "Default") {
        let obj = new Object();
        obj.Ingredients = []
        this.ingredients.forEach(element => {
            obj.ingredients.Push(element.ToOBJ())
        });
        return {nombre : his.nombre,costo: this.costo,unidad: this.xmedida,cantidad: this.cantidad, Sucursal : mysucursal,ingredientes: obj.ingredients} ;
    }
    Instance(instance = null) {
        instance = new Recipe(this.nombre, this.costo, this.xmedida, this.cantidad, this.medida)
        this.ingredients.forEach((element) => {
            instance.ingredients.push(element)
        })
        return instance
    }

    GetIngredients() {
       /* if(this.counter < this.servings)
        {
            this.counter++;
            return;
        }else
        {
            this.counter = 0;
        }*/

        let allIng = new Recipe("Alling",0,"",0,"")
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].constructor.name == "Recipe") {
                let ing = this.ingredients[i].GetIngredients()
                for (let j = 0; j < this.ingredients[i].cantidad; j++) {
                    ing.forEach(element => {
                        allIng.AddItem(element)
                    })
                }

            } else if (this.ingredients[i].constructor.name == "Ingredient") {
                allIng.AddItem(this.ingredients[i])
            }
        }
        return allIng.ingredients;
    }
    GetContent()
    {
        let content = []
        let header = ["Nombre","Ingredientes","Costo","MedidaXprecio","Cantidad","Medida","Marca"]
        content.push(header)
        this.GetIngredients().forEach((element) => {
            content.push([this.nombre,element.nombre,element.costo,element.xmedida,element.cantidad,element.medida,element.marca])
        })

        return content
    }

    GetItem(name) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === name) {
                return this.ingredients[i]
            }
        }
        return null
    }

    GetItemCopy(name) {
        return GetItem(name).Instance()
    }

    AddItem(IngredientToAdd) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].cantidad = parseFloat(IngredientToAdd.cantidad) + parseFloat(this.ingredients[i].cantidad)
                return
            }
        }
        this.ingredients.push(IngredientToAdd.Instance())
    }
    SubItem(IngredientToAdd) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].cantidad = - parseFloat(IngredientToAdd.cantidad) + parseFloat(this.ingredients[i].cantidad)
                return
            }
        }
        IngredientToAdd.cantidad = - IngredientToAdd.Instance().cantidad
        this.ingredients.push(IngredientToAdd.Instance())
    }
    ClearItems() {
        this.ingredients = []
    }

    AddValue(IngredientToAdd) {
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].cantidad = parseFloat(IngredientToAdd.cantidad) + parseFloat(this.ingredients[i].cantidad)

            }
        }
    }
    UpdateItem(IngredientToAdd) {
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i] = IngredientToAdd
                return
            }
        }
    }
    UpdateItemMeasure(IngredientToAdd) {
        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].medida = IngredientToAdd.medida
                this.ingredients[i].xmedida = IngredientToAdd.xmedida
                return
            }
        }
    }
    UpdateItemCost(IngredientToAdd) {

        for (let i = 0; i < this.ingredients.length; i++) {
            if (this.ingredients[i].nombre === IngredientToAdd.nombre) {
                this.ingredients[i].costo = IngredientToAdd.costo
                return
            }
        }
    }
}

class Inventory extends Recipe {
    constructor(nombre = "Inventory") {
        super(nombre, "", "", "", "")
    }
    Instance(instance = null) {
        instance = new Inventory()
        this.ingredients.forEach((element) => {
            instance.ingredients.push(element)
        })
        return instance
    }
    ToString() {
        let txt = ""
        txt += "<h2>" + this.nombre + " </h2>"
        this.ingredients.forEach(element => {
            txt += "<p>" + element.ToString() + " </p>"
        });
        return txt
    }
    ToOBJ(mysucursal = "Default") {
        let obj = new Object();
        obj.Ingredients = [];
        this.ingredients.forEach(element => {
            obj.ingredients.Push(element.ToOBJ())
        });
        return {nombre : his.nombre,costo: this.costo,unidad: this.xmedida,cantidad: this.cantidad, Sucursal : mysucursal,ingredientes: obj.ingredients} ;
    }
    ToExcel()
    {
        let f = this.GetContent();

        let ex = new Excel(f);

        return ex;
    }

}

class company {
    constructor(user, inventoryList, owner, role) {
        this.user = user
        this.inventoryList = inventoryList
        this.owner = owner
        this.role = role
    }
}

class Role {

}

class DropDown {
    constructor(body) {
        this.body = body
        this.itemKey = []
        this.itemValue = []
    }
    GetKeyIndex(key) {
        for (let i = 0; i < this.itemKey.length; i++) {
            if (this.itemKey[i] == key) { return i }

        }
        return -1
    }

    PushItems1D(items = []) {
        let a = []
        let b = []
        for (let i = 0; i < items.length; i++) {

            if (i % 2 == 0) {
                a.push(items[i])
            } else {
                b.push(items[i])
            }

        }
        this.PushItems(a, b)
    }

    PushItems(itemsKey = [], itemsValue = []) {
        const temp = this.body.selectedIndex
        if (itemsKey.length == itemsValue.length) {
            for (let i = 0; i < itemsKey.length; i++) {
                this.PushItem(itemsKey[i], itemsValue[i]);
            }
            this.UpdateDD()
        }
        this.body.selectedIndex = temp
    }
    PushItem(itemKey, itemValue) {
        const index = this.GetKeyIndex(itemKey)
        if (index >= 0) {
            this.itemKey[index] = itemKey
            this.itemValue[index] = itemValue
        } else {
            this.itemKey.push(itemKey)
            this.itemValue.push(itemValue)
        }

    }
    UpdateDD() {
        this.body.innerHTML = ""
        for (let i = 0; i < this.itemKey.length; i++) {
            this.body.innerHTML +=
                `<option value="${this.itemKey[i]}">${this.itemValue[i]}</option>`
        }
    }
    CopyDD(body) {
        body.innerHTML = ""
        for (let i = 0; i < this.itemKey.length; i++) {
            body.innerHTML +=
                `<option value="${this.itemKey[i]}">${this.itemValue[i]}</option>`
        }
    }
}

class Excel {
    constructor(content) {
        this.content = content;
    }

    Header() {
        return this.content[0]
    }

    Rows() {
        return this.content.slice(1, this.content.length)
    }
    Columns() {
        return this.content_T.slice(1, this.content_T.length)
    }
    Transpose() {
        this.content_T = this.Transpose(this.content)
    }
    Transpose(table2D) {
        let transpose = []
        for (let i = 0; i < table2D[i].length; i++) {
            let col = []
            for (let j = 0; j < table2D.length; j++) {
                col.push(table2D[j][i])
            }
            transpose.push(col)
        }
        return transpose
    }
    GetSchema(Object = []) {

        let mk = []
        for (let i = 0; i < Object.length; i++) {
            let makeObj = {}
            makeObj["column"] = Object[i]
            if (typeof Object[i] == "string") {
                makeObj["type"] = String
            } else {
                makeObj["type"] = Number,
                    makeObj["format"] = '#,##0.00'
            }
            makeObj["value"] = (element) => element["op"+i] 
            mk.push(makeObj)
        }
        return mk
    }

    GetObject(Object = []) {
        let makeObj = {}
        for (let i = 0; i < Object.length; i++) {
            makeObj["op" + i] = Object[i] + "" || "";
        }
        return makeObj
    }
    GetObjectGroup(Object = []) {
        let makeObj = []
        for (let i = 0; i < Object.length; i++) {
            makeObj.push(this.GetObject(Object[i]));
        }
        return makeObj
    }
}
class RowCollection {
    constructor(rows) {
        this.rows = rows
    }
    first() {
        return this.rows[0]
    }
    get() {
        return this.rows
    }
    count() {
        return this.rows.length
    }
}

class Row {
    constructor(row) {
        this.row = row
    }
    name() {
        return this.row[0]
    }
    cost() {
        return this.row[1]
    }
    costmeasure() {
    }
    amount() {
        return this.row[2]
    }
    measure() {
        return this.row[3]
    }
    brand() {
        return this.row[4]
    }
    lastEdit() {

    }
    alertState() {

    }

    
}

var unidades = 
{
    'Longitud': 
    {
        'grupo': 'Longitud',
        'unidades': 
            [
                'kilometro',
                'metro',
                'centimetro',
                'milimetro',
                'micrometro',
                'nanometro',
                'milla',
                'yarda',
                'pie',
                'pulgada'
            ],
        'equivalencias': 
            {
                'kilometro': 
                {
                    'kilometro': 1,
                    'metro': 1000,
                    'centimetro': 100000,
                    'milimetro': 1e+6,
                    'micrometro': 1e+9,
                    'nanometro': 1e+12,
                    'milla': 0.621371,
                    'yarda': 1093.61,
                    'pie': 3280.84,
                    'pulgada': 39370.1
                },
            }    
    },
    'Peso': 
    {
        'grupo': 'Peso',
        'unidades': 
            [
                'Libras',
                'Kilogramos',
                'Onzas',
                'Piedras',
                'Libras de Troy',
                'Onzas de Troy',
                'Gramos',
                'Miligramos',
                'Microgramos',
                'Quilates',
                'Quintales cortos',
                'Quintales largos'
            ],
        'equivalencias': 
            {
                'Gramos': 
                {
                    'Libras' : 1/0.0022046,
                    'Kilogramos' : 1000,
                    'Onzas' : 1/0.035274,
                    'Piedras' : 1/0.00015747,
                    'Libras de Troy' : 1/0.0026792,
                    'Onzas de Troy' : 1/0.032151,
                    'Gramos' : 1,
                    'Miligramos' : 1/1000,
                    'Microgramos' : 1/1000000,
                    'Quilates' : 1/5,
                    'Quintales cortos' : 1/0.000022046,
                    'Quintales largos' : 1/0.000019684
                },
            }    
    },
    'Volumen': 
    {
        'grupo': 'Volumen',
        'unidades': 
            [
                'Litros',
                'Mililitros',
                'Cuartos de Galón',
                'Cucharilla de café',
                'Barriles',
                'Cucharadas',
                'Cucharillas',
                'Tazas',
                'Galones',
                'Pintas',
                'Onzas',
                'Cucharillas',
                'Tazas',
                'Galones' 
            ],
        'equivalencias': 
            {
                'Mililitros': 
                {
                    'Litros' : 1000,
                    'Mililitros' : 1,
                    'Cuartos de Galón' : 1/0.0010567,
                    'Cucharilla métrica' : 1/0.2,
                    'Barriles' : 1/0.0000083864,
                    'Cucharadas' : 1/0.067628,
                    'Cucharillas' : 1/0.20288,
                    'Tazas' : 1/0.0042268,
                    'Tazas métricas' : 1/0.004,
                    'Galones' : 3785.4118,
                    'Pintas' : 1/0.0021134,
                    'Onzas' : 1/0.033814
                },
            }    
    }
};

class Conversion
{
    
    constructor()
    {
    }

    Convert(from,to,qty,Type,Revert = false)
    {
        if(Revert)
        {
            return qty / unidades[Type]["equivalencias"][from][to]
        }else
        {
            return qty * unidades[Type]["equivalencias"][to][from]
        }

        
    }

    ToGrames(Type,Qty)
    {
        
        return Convert(Type,"Gramos",Qty,"Peso",false)
    }

    FromGrames(Type,Qty)
    {
        return Convert("Gramos",Type,Qty,"Peso",true)
    }
    ToMililitres(Type,Qty)
    {
        
        return Convert(Type,"Mililitros",Qty,"Volumen",false)
    }

    FromMililitres(Type,Qty)
    {
        return Convert("Mililitros",Type,Qty,"Volumen",true)
    }
}

