import conditionParser from "../src/conditionParser";

test("one token", function(){
    expect(conditionParser("$hello.world$ == 13", "root"))
        .toBe('mapFactoryGetValue(root, "hello.world") == 13');
});

test("two token", function(){
    expect(conditionParser("$hello.world$ >= $my$", "root"))
        .toBe('mapFactoryGetValue(root, "hello.world") >= mapFactoryGetValue(root, "my")');
});

test("root token", function(){
    expect(conditionParser("$$ === 4", "root"))
        .toBe('root === 4');
});

test("error token", function(){
    expect(function(){
        conditionParser("my$ = 3", "root");
    }).toThrowError();
});

test("extreme case 1", function(){
    expect(conditionParser("$$$$$$$$$$", "root"))
        .toBe('rootrootrootrootroot');
});

test("extreme case 2", function(){
    expect(function(){
        conditionParser("$$$$$$$$$$$", "root");
    }).toThrowError();
});

test("empty condition", function(){
    expect(conditionParser("", "root"))
        .toBe('');
});
test("empty root variable name", function(){
    expect(function(){
        conditionParser("$$$$$$$$$$$", "");
    }).toThrowError();
});
