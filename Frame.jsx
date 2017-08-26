// Configuration
var conf = {
    outputFolderName: 'output',
    fileSuffix: '(framed)',
    layers: {
        frame: 'frame',
        image: 'image'
    },
    i18n: {
        noFilesSelected: 'No files selected',
        selectFiles: 'Please select files',
    },
    fileTypes: '*.jpg;*.jpeg;',
};

// Globals
var doc = app.activeDocument
var frame = doc.layers.getByName(conf.layers.frame);
var image = doc.layers.getByName(conf.layers.image);

var SMART_OBJECT = 'LayerKind.SMARTOBJECT';

// Functions
function run() {
    var files = openFiles();

    if (files) { 
        for (var i = 0; i < files.length; i++) { 
            var smartObject = openSmartObject(image);
            var innerObject = smartObject.activeLayer;
            if (innerObject.kind == SMART_OBJECT) {  
                replaceContents(files[i]);
            };  
            smartObject.close(SaveOptions.SAVECHANGES);  
            savePng(files[i].name + conf.fileSuffix);
        }  
    } else {
        alert(conf.i18n.noFilesSelected);
    }
}

function openFiles() {
    if ($.os.search(/windows/i) != -1) {
        return File.openDialog(conf.i18n.selectFiles, conf.fileTypes, true);
    } else {
        return File.openDialog(conf.i18n.selectFiles, getFiles, true);
    }
}

function openSmartObject(theLayer) {  
    if (image.kind == SMART_OBJECT) { 
        var idplacedLayerEditContents = stringIDToTypeID('placedLayerEditContents');  
        var desc = new ActionDescriptor();  
        executeAction(idplacedLayerEditContents, desc, DialogModes.NO);  
    }

    return app.activeDocument; 
}

function replaceContents(newFile) {
    var idplacedLayerReplaceContents = stringIDToTypeID('placedLayerReplaceContents');  
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID('null');
    desc.putPath(idnull, new File(newFile));
    var idPgNm = charIDToTypeID('PgNm');
    desc3.putInteger(idPgNm, 1);
    executeAction(idplacedLayerReplaceContents, desc, DialogModes.NO);

    return app.activeDocument.activeLayer;
}

function savePng(name) {
    var folderStructure = '/' + conf.outputFolderName + '/';
    var folder = Folder(doc.path + folderStructure);
    if(!folder.exists) folder.create();

    var location = new File(doc.path + folderStructure + name);
    var pngSaveOptions = new PNGSaveOptions(); 
    activeDocument.saveAs(location, pngSaveOptions, true, Extension.LOWERCASE); 
}

// Run the script
run();
