var doc = app.activeDocument
var frame = doc.layers.getByName('frame');
var image = doc.layers.getByName('image');

if ($.os.search(/windows/i) != -1) {var theFiles = File.openDialog ("please select files", "*.jpg;*.jpeg;*.JPG;", true)}   
else {var theFiles = File.openDialog ("please select files", getFiles, true)};

if (theFiles) { 
    for (var m = 0; m < theFiles.length; m++) { 
        var smartObject = openSmartObject(image);
        var theLayer2 = smartObject.activeLayer;
        if (theLayer2.kind == "LayerKind.SMARTOBJECT") {  
            replaceContents(theFiles[m]);
        };  
        smartObject.close(SaveOptions.SAVECHANGES);  
        savePng(theFiles[m].name + '(framed)');
    }  
}  


function openSmartObject(theLayer) {  
    if (image.kind == "LayerKind.SMARTOBJECT") { 
        var idplacedLayerEditContents = stringIDToTypeID( "placedLayerEditContents" );  
        var desc2 = new ActionDescriptor();  
        executeAction( idplacedLayerEditContents, desc2, DialogModes.NO );  
    };  

    return app.activeDocument  
}

function replaceContents(newFile) {
    var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerReplaceContents" );  
    var desc3 = new ActionDescriptor();  
    var idnull = charIDToTypeID("null");  
    desc3.putPath(idnull, new File(newFile));  
    var idPgNm = charIDToTypeID( "PgNm" );  
    desc3.putInteger(idPgNm, 1);  
    executeAction(idplacedLayerReplaceContents, desc3, DialogModes.NO);  
    return app.activeDocument.activeLayer  
};

function savePng(name) {
    var folderName = 'output';
    var folderStructure = '/' + folderName + '/';
    var folder = Folder(doc.path + folderStructure);
    if(!folder.exists) folder.create();

    var location = new File(doc.path + folderStructure + name);
    var pngSaveOptions = new PNGSaveOptions(); 
    activeDocument.saveAs(location, pngSaveOptions, true, Extension.LOWERCASE); 
}