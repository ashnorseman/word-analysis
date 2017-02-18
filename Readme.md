## Step by step guides

### Step 1: Create meta data

```
npm run create:lemma
npm run create:emotion
```

### Step 2: Fetch band list

```
npm run fetch:bands
```

### Step 3: Fetch album list

```
npm run fetch:albums
```

### Step 4: Fetch lyrics html documents

```
npm run fetch:lyrics
```

### Step 5: Strip raw text files

```
npm run strip
```

### Step 6: Tag POS

```
npm run tag
```

### Step 7: Count word frequency

```
npm run frequency
```

## POS Tag List

Alphabetical list of part-of-speech tags used in the project:

    CC Coord Conjuncn           and,but,or
    CD Cardinal number          one,two
    DT Determiner               the,some
    EX Existential there        there
    FW Foreign Word             mon dieu
    IN Preposition              of,in,by
    JJ Adjective                big
    JJR Adj., comparative       bigger
    JJS Adj., superlative       biggest
    LS List item marker         1,One
    MD Modal                    can,should
    NN Noun, sing. or mass      dog
    NNP Proper noun, sing.      Edinburgh
    NNPS Proper noun, plural    Smiths
    NNS Noun, plural            dogs
    POS Possessive ending       �s
    PDT Predeterminer           all, both
    PP$ Possessive pronoun      my,one�s
    PRP Personal pronoun         I,you,she
    RB Adverb                   quickly
    RBR Adverb, comparative     faster
    RBS Adverb, superlative     fastest
    RP Particle                 up,off
    SYM Symbol                  +,%,&
    TO �to�                     to
    UH Interjection             oh, oops
    VB verb, base form          eat
    VBD verb, past tense        ate
    VBG verb, gerund            eating
    VBN verb, past part         eaten
    VBP Verb, present           eat
    VBZ Verb, present           eats
    WDT Wh-determiner           which,that
    WP Wh pronoun               who,what
    WP$ Possessive-Wh           whose
    WRB Wh-adverb               how,where
    , Comma                     ,
    . Sent-final punct          . ! ?
    : Mid-sent punct.           : ; �
    $ Dollar sign               $
    # Pound sign                #
    " quote                     "
    ( Left paren                (
    ) Right paren               )
