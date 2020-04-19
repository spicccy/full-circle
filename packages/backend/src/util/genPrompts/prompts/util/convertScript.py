import json

def main():
    f = open("input.txt", "r+")
    prompt = f.readline()
    prompts = []
    counter = 0
    while(prompt != ''):
        print(prompt)
        prompt = prompt.replace('\n','')
        prompts.append({
            'id': counter,
            'prompt': (prompt.upper())
        })
        prompt = f.readline()
        counter +=1
    json_str = json.dumps(prompts, indent=4)

    print(json_str)
    f.close()

    f = open('output.txt', "w+")
    f.write(json_str)
    f.close()

if __name__ == '__main__':
    main()