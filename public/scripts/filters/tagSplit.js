angular.module("babelpop").filter("tagSplit", function() {
    return function(input) {
        var str = "tags: ";
        if (input.length > 0) {
            for (var i = 0; i < input.length - 1; i++) {
                str += input[i] + ", ";
            }
            str += input[input.length - 1];
        } else {
            str += "-";
        }
        return str;
    };
});
