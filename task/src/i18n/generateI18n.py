# -*- utf-8 -*-

import csv
import os
import json
import shutil
import argparse

INDEX_VER = 0
INDEX_COMMENT = 1
INDEX_SCOPE_ID = 2
LAN_INDEX = {
    "en": 3,
    "zh": 4,
    # "fr": 5,
    # "de": 6,
    # "es": 7,
    # "ru": 8,
    # "hi": 9,
    # "id": 10,
    # "ja": 11,
    # "pt": 12,
    # 对应文件的行数
}


def parse_i18n_csv(filepath, lans):
    line_count = 0
    trans_count = 0
    with open(filepath, newline='', encoding='UTF-8') as csvfile:
        filereader = csv.reader(csvfile)
        for row in filereader:
            if line_count > 0:
                #
                key = row[INDEX_SCOPE_ID]
                #key = '_'.join(filter(None, [scope_id]))
                if key != '':
                    for lan, col in LAN_INDEX.items():
                        if lan not in lans:
                            lans[lan] = {}
                        translation = row[col]
                        if translation and (len(translation) > 0):
                            if key not in lans[lan]:
                                lans[lan][key] = translation
                                trans_count += 1
                            else:
                                raise Exception(
                                    "{} is alreay added, {}".format(key, translation))
                else:
                    raise Exception("row is empty")
            else:
                # first line
                pass
            line_count += 1
        print("handle {} items".format(trans_count))


def export_i18n_lan_files(pathdir, lans):
    if not os.path.isdir(pathdir):
        os.mkdir(pathdir)
    for lan, translations in lans.items():
        if len(translations) > 0:
            with open("{}/{}.json".format(pathdir, lan), 'w', encoding='UTF-8') as lan_js_file:
                lan_js_file.write(
                    "{\n")
                # lan_js_file.write("export const {} = {{\n".format(lan))
                i=0
                for key, translation in translations.items():
                    i+=1
                    splite = '' if i==len(translations.keys()) else ','
                    lan_js_file.write("  \"%s\": \"%s\" %s\n" % (key.replace("\n", ""), translation.replace("\n", ""),splite),)
                lan_js_file.write("}")


def export_i18n_lan_keys_file(pathdir, lans):
    keys = set()
    for lan, translations in lans.items():
        if len(translations) > 0:
            for key in translations.keys():
                keys.add(key)
    key_list = list(keys)
    key_list.sort()
    with open("{}/keys.ts".format(pathdir), 'w', encoding='UTF-8') as keys_js_file:
        keys_js_file.write(
            "/* eslint-disable @typescript-eslint/camelcase */\n")
        keys_js_file.write("export enum I18nLangKey {\n")
        for key in key_list:
            if '.' in key:
                print('keys文件跳过 {}'.format(key))
                continue
            keys_js_file.write("  {} = \'{}\',\n".format(key, key))
        keys_js_file.write("};")


def export_i18n_index_file(pathdir, lans):
    with open("{}/index.ts".format(pathdir), 'w', encoding='UTF-8') as index_js_file:
        available_lans = []
        for lan in lans.keys():
            if os.path.isfile("{}/{}.ts".format(pathdir, lan)):
                available_lans.append(lan)
        index_js_file.write("import I18n from 'i18n-js';\n")
        index_js_file.write(
            "import * as RNLocalize from 'react-native-localize';\n")
        for lan in available_lans:
            index_js_file.write(
                "import {{ {} }} from './{}';\n".format(lan, lan))
        index_js_file.write("export * from './keys';\n")
        index_js_file.write("I18n.fallbacks = true;\n")
        index_js_file.write("I18n.translations = {\n")
        for lan in available_lans:
            index_js_file.write("  {},\n".format(lan))
        index_js_file.write("};\n")
        index_js_file.write(
            "const [{ languageCode }] = (RNLocalize.getLocales() || [{ languageCode: 'en' }]);\n")
        index_js_file.write("I18n.locale = languageCode;\n")
        index_js_file.write("export default I18n;\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", help="xml dir", default=".")
    parser.add_argument("--output", help="output dir",
                        default="./locales")
    parser.add_argument("--verbose", help="verbose",
                        default=False, action="store_true")
    args = parser.parse_args()

    lans = {}
    parse_i18n_csv(
        "{}/classpod_teacher.csv".format(args.input), lans)

    shutil.rmtree(args.output)
    export_i18n_lan_files(args.output, lans)
    # export_i18n_lan_keys_file(args.output, lans)
    # export_i18n_index_file(args.output, lans)
